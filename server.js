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

  const prompt = `You are SitPred, a world-class game theory and competitive strategy analyst. You combine academic game theory (Nash equilibrium, dominant strategies, Prisoner's Dilemma, Stackelberg competition, repeated games) with real-world business strategy consulting.

Industry: ${industry || 'General'}
Number of players: ${players || '2'}
Game type: ${gameType || 'simultaneous'}

Scenario:
${context}

Analyse this using game theory and return ONLY a valid JSON object with these exact fields — no markdown, no backticks, no extra text:

{
  "equilibrium_type": "short label e.g. Nash Equilibrium / Dominant Strategy / No Pure Strategy",
  "stability": "High / Medium / Low",
  "conflict_risk": "High / Medium / Low",
  "situation_title": "Sharp 6-8 word title describing the core tension",
  "situation_analysis": "2-3 sentences. What game theory framework applies and why. Be precise and analytical.",
  "players": [
    {
      "name": "Player name or label",
      "dominant_move": "Specific action they will likely take",
      "reasoning": "1-2 sentence game theory reasoning",
      "is_dominant": true
    }
  ],
  "outcomes": [
    { "label": "Outcome name", "probability": 65, "color": "green|blue|amber|red" },
    { "label": "Outcome name", "probability": 25, "color": "green|blue|amber|red" },
    { "label": "Outcome name", "probability": 10, "color": "green|blue|amber|red" }
  ],
  "recommendation_title": "Sharp action-oriented title for the best strategic move",
  "recommendation": "3-4 sentences. Specific, concrete strategic recommendation based on game theory.",
  "longterm_title": "Sharp title for the long-term market prediction",
  "longterm": "3-4 sentences. Where does this market situation end up in 2-4 quarters?"
}`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      })
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      return res.status(500).json({ error: 'No response from Gemini.' });
    }

    let raw = data.candidates[0].content.parts[0].text.trim();
    raw = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SitPred running on http://localhost:${PORT}`);
});
