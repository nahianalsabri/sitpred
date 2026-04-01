require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/analyze', async (req, res) => {
  const { context, industry, players, gameType } = req.body;

  if (!context || context.trim().length < 30) {
    return res.status(400).json({ error: 'Please provide a more detailed scenario.' });
  }

  const systemPrompt = `You are SitPred, a world-class game theory and competitive strategy analyst. You combine academic game theory (Nash equilibrium, dominant strategies, Prisoner's Dilemma, Stackelberg competition, repeated games) with real-world business strategy consulting.

Return ONLY a valid JSON object — no markdown, no backticks, no extra text whatsoever:
{
  "equilibrium_type": "short label e.g. Nash Equilibrium / Dominant Strategy",
  "stability": "High / Medium / Low",
  "conflict_risk": "High / Medium / Low",
  "situation_title": "Sharp 6-8 word title describing the core tension",
  "situation_analysis": "2-3 sentences. What game theory framework applies and why.",
  "players": [
    {"name": "Player name", "dominant_move": "Specific action they will take", "reasoning": "1-2 sentence reasoning", "is_dominant": true}
  ],
  "outcomes": [
    {"label": "Outcome name", "probability": 65, "color": "green"},
    {"label": "Outcome name", "probability": 25, "color": "blue"},
    {"label": "Outcome name", "probability": 10, "color": "red"}
  ],
  "recommendation_title": "Action-oriented title",
  "recommendation": "3-4 sentences. Concrete strategic recommendation.",
  "longterm_title": "Long-term prediction title",
  "longterm": "3-4 sentences. Where does this end up in 2-4 quarters?"
}`;

  const userPrompt = `Industry: ${industry || 'General'}
Number of players: ${players || '2'}
Game type: ${gameType || 'simultaneous'}

Scenario:
${context}

Analyse using game theory and return only the JSON.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data).slice(0, 400));

    if (!data.choices || !data.choices[0]) {
      const errMsg = data.error ? data.error.message : 'No response from Groq.';
      return res.status(500).json({ error: errMsg });
    }

    let raw = data.choices[0].message.content.trim();
    raw = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Analysis failed: ' + err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SitPred running on http://localhost:${PORT}`);
});
