require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
  const { context, industry, players, gameType } = req.body;

  if (!context || context.trim().length < 30) {
    return res.status(400).json({ error: 'Please provide a more detailed scenario.' });
  }

  const systemPrompt = `You are a game theory analyst. You must respond with ONLY a JSON object. No explanation, no markdown, no backticks, no text before or after. Just the raw JSON.

The JSON must have exactly these fields:
{"equilibrium_type":"string","stability":"High or Medium or Low","conflict_risk":"High or Medium or Low","situation_title":"string","situation_analysis":"string","players":[{"name":"string","dominant_move":"string","reasoning":"string","is_dominant":true}],"outcomes":[{"label":"string","probability":65,"color":"green"},{"label":"string","probability":25,"color":"blue"},{"label":"string","probability":10,"color":"red"}],"recommendation_title":"string","recommendation":"string","longterm_title":"string","longterm":"string"}`;

  const userPrompt = `Industry: ${industry || 'General'}
Players: ${players || '2'}
Game type: ${gameType || 'simultaneous'}
Scenario: ${context}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data).slice(0, 500));

    if (!data.choices || !data.choices[0]) {
      const errMsg = data.error ? data.error.message : 'No response from AI.';
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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SitPred running on http://localhost:${PORT}`);
});
