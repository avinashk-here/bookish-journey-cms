// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Single endpoint
// server/index.js
// … (keep all requires & app setup)

app.post('/api/generate', async (req, res) => {
  const { model, prompt, context } = req.body;

  let url, headers, payload;

  const modelStr = String(model).trim().toLowerCase();

  // ---------- 1. OpenAI ----------
  if (modelStr.includes('gpt')) {
    url = 'https://api.openai.com/v1/chat/completions';
    headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    };
    const maxTokens = modelStr.includes('gpt-4-turbo') ? 4096 : 10000;
    payload = {
      model: model,                    // already the real ID
      messages: [{ role: 'user', content: `${prompt}\n\n${context}` }],
      max_completion_tokens: maxTokens,     // fixes parameter error
     
    };

  // ---------- 2. Perplexity ----------
  } else if (modelStr.includes('sonar')) {
    url = 'https://api.perplexity.ai/chat/completions';
    headers = {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    };
    payload = {
      model: model,
      messages: [{ role: 'user', content: `${prompt}\n\n${context}` }],
      max_completion_tokens: 10000,
      temperature: 0.3,
    };

  // ---------- 3. Unknown ----------
  } else {
    return res.status(400).json({ error: 'Unknown model' });
  }

  try {
    const { data } = await axios.post(url, payload, { headers });
    const formattedResponse = {
     citations: data.citations,
     content: data.choices[0]?.message?.content || '',
   };
    res.json(formattedResponse);

    
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// … (keep app.listen)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));