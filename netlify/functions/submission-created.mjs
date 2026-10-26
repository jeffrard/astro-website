// Runs automatically after every verified (non-spam) Netlify form submission.
// Sends quote requests to Go High Level as a contact, with the project details as a note.
// Needs two environment variables in Netlify: GHL_API_TOKEN (Private Integration token) and GHL_LOCATION_ID.

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

export default async (req) => {
  const { payload } = await req.json();
  if (payload.form_name !== 'quote') return new Response('Not a quote form', { status: 200 });

  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error('GHL_API_TOKEN or GHL_LOCATION_ID is not set; lead was not sent to GHL.');
    return new Response('Missing GHL settings', { status: 200 });
  }

  const d = payload.data || {};
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
    return new Response('GHL contact failed', { status: 200 });
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
  return new Response('OK', { status: 200 });
};
