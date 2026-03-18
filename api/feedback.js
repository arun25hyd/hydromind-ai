export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, role, org, country, rating, categories, usage, feedback, recommend } = req.body;

  if (!name || !feedback) {
    return res.status(400).json({ error: 'Name and feedback are required' });
  }

  const emailBody = `
NEW FEEDBACK — HydroMind.AI
============================
Name:         ${name}
Role:         ${role || '—'}
Organisation: ${org || '—'}
Country:      ${country || '—'}
Rating:       ${rating || 'Not rated'}
Categories:   ${categories || 'None selected'}
Used for:     ${usage || '—'}
Recommend:    ${recommend || 'Not answered'}

FEEDBACK:
${feedback}
============================
Sent from: hydromindai.com/pages/feedback.html
`;

  // Always log to Vercel logs as permanent backup
  console.log('=== HYDROMIND FEEDBACK ===');
  console.log(emailBody);
  console.log('=== END FEEDBACK ===');

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return res.status(200).json({ success: true });
  }

  try {
    // Send to BOTH Gmail AND Zoho for reliability
    // Resend free plan: can send to any address from onboarding@resend.dev
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: 'HydroMind Feedback <onboarding@resend.dev>',
        to: ['arun25hyd@gmail.com', 'support@hydromindai.com'],
        subject: `[HydroMind.AI] New Feedback from ${name}`,
        text: emailBody,
        html: `<pre style="font-family:monospace;font-size:14px;line-height:1.6;">${emailBody}</pre>`
      })
    });

    const data = await response.json();
    console.log('Resend result:', JSON.stringify(data));

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Feedback send error:', err.message);
    return res.status(200).json({ success: true });
  }
}
