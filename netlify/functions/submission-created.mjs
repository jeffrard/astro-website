// Runs automatically after every verified (non-spam) Netlify form submission.
// For quote requests it does two independent things, so one failing never blocks the other:
//   1. Go High Level: upserts the contact and adds the project details as a note.
//      Needs GHL_API_TOKEN (Private Integration token) and GHL_LOCATION_ID.
//   2. Slack: posts a new-lead alert to the channel behind SLACK_WEBHOOK_URL (an incoming webhook).

const GHL = 'https://services.leadconnectorhq.com';
const HEADERS = (token) => ({
  Authorization: `Bearer ${token}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

// "(651) 341-7483" -> "+16513417483"; anything that isn't a US number is passed through as typed.
function toE164(raw) {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return (raw || '').trim();
}

async function sendToGhl(d) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error('GHL_API_TOKEN or GHL_LOCATION_ID is not set; lead was not sent to GHL.');
    return;
  }

  const name = (d.name || '').trim();
  const [firstName, ...rest] = name.split(/\s+/);
  const service = (d.service || '').trim();

  const contact = {
    locationId,
    name,
    firstName: firstName || undefined,
    lastName: rest.join(' ') || undefined,
    email: (d.email || '').trim() || undefined,
    phone: toE164(d.phone) || undefined,
    source: 'Website quote form',
    tags: ['website lead', service && service.toLowerCase()].filter(Boolean),
  };

  // Upsert so a repeat visitor updates their existing contact instead of creating a duplicate.
  const res = await fetch(`${GHL}/contacts/upsert`, { method: 'POST', headers: HEADERS(token), body: JSON.stringify(contact) });
  if (!res.ok) {
    console.error(`GHL contact upsert failed (${res.status}): ${await res.text()}`);
    return;
  }
  const contactId = (await res.json()).contact?.id;

  const note = [
    'Website quote request',
    `Service: ${service || 'Not given'}`,
    `Phone: ${d.phone || 'Not given'}`,
    '',
    d.message ? d.message.trim() : '(No project details)',
  ].join('\n');
  if (contactId) {
    const n = await fetch(`${GHL}/contacts/${contactId}/notes`, { method: 'POST', headers: HEADERS(token), body: JSON.stringify({ body: note }) });
    if (!n.ok) console.error(`GHL note failed (${n.status}): ${await n.text()}`);
  }

  console.log(`Sent quote request to GHL as contact ${contactId}`);
}

// Slack mrkdwn treats &, < and > as control characters; escape anything the visitor typed.
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function sendToSlack(d) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.error('SLACK_WEBHOOK_URL is not set; no Slack alert was sent.');
    return;
  }

  const name = (d.name || '').trim() || 'Someone';
  const service = (d.service || '').trim() || 'Not sure yet';
  const email = (d.email || '').trim();
  const phone = (d.phone || '').trim();
  const tel = toE164(phone);
  const message = (d.message || '').trim();

  const contactLine = [
    phone ? (tel.startsWith('+') ? `<tel:${tel}|${esc(phone)}>` : esc(phone)) : 'No phone given',
    email ? `<mailto:${esc(email)}|${esc(email)}>` : 'No email given',
  ].join('  ·  ');
  const quoted = message ? esc(message).split('\n').map((l) => `>${l}`).join('\n') : '_No project details_';

  const body = {
    text: `New website lead: ${name} (${service})`, // notification preview
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `New website lead: ${service}`.slice(0, 150) } },
      { type: 'section', text: { type: 'mrkdwn', text: `*${esc(name)}*\n${contactLine}` } },
      { type: 'section', text: { type: 'mrkdwn', text: quoted.slice(0, 2900) } },
      { type: 'context', elements: [{ type: 'mrkdwn', text: 'From the astropainting.co quote form · also added to Go High Level' }] },
    ],
  };

  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) {
    console.error(`Slack alert failed (${res.status}): ${await res.text()}`);
    return;
  }
  console.log('Posted new-lead alert to Slack');
}

export default async (req) => {
  const { payload } = await req.json();
  if (payload.form_name !== 'quote') return new Response('Not a quote form', { status: 200 });

  const d = payload.data || {};
  const results = await Promise.allSettled([sendToGhl(d), sendToSlack(d)]);
  for (const r of results) if (r.status === 'rejected') console.error('Lead step crashed:', r.reason);

  return new Response('OK', { status: 200 });
};
