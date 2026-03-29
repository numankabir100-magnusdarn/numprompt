const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const templates = require('../templates/promptTemplates');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { prompt, template } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const selectedTemplate = templates[template] || templates.creative;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: selectedTemplate.systemPrompt },
        { role: 'user', content: `Refine this prompt:\n\n"${prompt}"` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    });

    const refined = chatCompletion.choices[0]?.message?.content || 'Could not refine prompt.';
    res.json({ refined });
  } catch (error) {
    console.error('Groq API Error:', error.message);
    res.status(500).json({ error: 'Failed to refine prompt. Please try again.' });
  }
});

module.exports = router;
