const Groq = require('groq-sdk');

const templatePrompts = {
  creative: `You are a creative writing expert. Take the user's rough prompt and refine it into an imaginative, vivid, and compelling prompt that will produce the most creative and engaging AI output. Add sensory details, emotional depth, and artistic flair. Keep the core intent intact.`,
  technical: `You are a technical documentation expert. Take the user's rough prompt and refine it into a precise, well-structured, and technically accurate prompt. Add specificity, define scope, mention expected output format, and include relevant technical constraints. Keep it clear and unambiguous.`,
  professional: `You are a business communication expert. Take the user's rough prompt and refine it into a polished, professional, and clear prompt suitable for corporate or formal contexts. Ensure proper tone, clarity of objectives, and actionable structure.`,
  scientific: `You are a research methodology expert. Take the user's rough prompt and refine it into a rigorous, methodical, and evidence-oriented prompt. Add hypothesis framing, variable specification, and analytical structure. Ensure scientific precision.`,
  business: `You are a strategic business analyst. Take the user's rough prompt and refine it into a data-driven, results-oriented, and strategically focused prompt. Include KPIs, market context, stakeholder considerations, and measurable outcomes.`
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
