export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, role, rating, categories, usage, feedback } = req.body;

  if (!name || !feedback) {
    return res.status(400).json({ error: 'Name and feedback are required' });
  }

  console.log('=== HYDROMIND FEEDBACK ===');
  console.log(`Name: ${name} | Role: ${role} | Rating: ${rating} | Feature: ${categories} | Plan: ${usage}`);
  console.log(`Feedback: ${feedback}`);
  console.log('=== END FEEDBACK ===');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '4ac24c17-fe70-4b40-a498-238c616f3f03',
        subject: `[HydroMind.AI] New Feedback from ${name} — ${rating}/5 stars`,
        from_name: 'HydroMind Feedback',
        name: name,
        message: `Name: ${name}\nRole: ${role || '—'}\nRating: ${rating}/5\nFeature: ${categories || '—'}\nPlan: ${usage || '—'}\n\nReview:\n${feedback}`,
        replyto: 'support@hydromindai.com'
      })
    });

    const data = await response.json();
    console.log('Web3Forms result:', JSON.stringify(data));

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Web3Forms error:', data);
      return res.status(200).json({ success: true }); // still return success to user
    }

  } catch (err) {
    console.error('Feedback error:', err.message);
    return res.status(200).json({ success: true });
  }
}
