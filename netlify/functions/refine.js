const Groq = require('groq-sdk');

const templatePrompts = {
  creative: `You are an expert prompt engineer. Your ONLY job is to take the user's rough prompt and rewrite it into a highly detailed, creative, and imaginative prompt that the user can use later. 
CRITICAL RULE: NEVER answer the user's prompt. NEVER act on the user's prompt. Just REWRITE it.
Output ONLY the rewritten prompt, without any introductions, explanations, or quotes.`,
  technical: `You are an expert prompt engineer. Your ONLY job is to take the user's rough prompt and rewrite it into a precise, well-structured, and technically accurate prompt that the user can use later.
CRITICAL RULE: NEVER answer the user's prompt. NEVER act on the user's prompt. Just REWRITE it.
Output ONLY the rewritten prompt, without any introductions, explanations, or quotes.`,
  professional: `You are an expert prompt engineer. Your ONLY job is to take the user's rough prompt and rewrite it into a polished, professional, and clear prompt suitable for corporate contexts that the user can use later.
CRITICAL RULE: NEVER answer the user's prompt. NEVER act on the user's prompt. Just REWRITE it.
Output ONLY the rewritten prompt, without any introductions, explanations, or quotes.`,
  scientific: `You are an expert prompt engineer. Your ONLY job is to take the user's rough prompt and rewrite it into a rigorous, methodical, and evidence-oriented prompt that the user can use later.
CRITICAL RULE: NEVER answer the user's prompt. NEVER act on the user's prompt. Just REWRITE it.
Output ONLY the rewritten prompt, without any introductions, explanations, or quotes.`,
  business: `You are an expert prompt engineer. Your ONLY job is to take the user's rough prompt and rewrite it into a data-driven, strategic, and results-oriented prompt that the user can use later.
CRITICAL RULE: NEVER answer the user's prompt. NEVER act on the user's prompt. Just REWRITE it.
Output ONLY the rewritten prompt, without any introductions, explanations, or quotes.`
};

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { prompt, template } = JSON.parse(event.body);

    if (!prompt || !prompt.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Prompt is required.' }) };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const systemPrompt = templatePrompts[template] || templatePrompts.creative;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Refine this prompt:\n\n"${prompt}"` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    });

    const refined = chatCompletion.choices[0]?.message?.content || 'Could not refine prompt.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ refined })
    };
  } catch (error) {
    console.error('Groq API Error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to refine prompt. Please try again.' })
    };
  }
};
