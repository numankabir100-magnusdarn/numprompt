const Groq = require('groq-sdk');

const templatePrompts = {
  creative: `You are a Master Prompt Engineer. Your ONLY job is to convert the user's raw idea into a strict, "Logic-First" structured prompt.
CRITICAL RULES:
1. DO NOT write a narrative or just "refine" their text. 
2. Define the Logic first and the Text second. Break it down into clear, highly rigid constraints.
3. Output MUST follow this EXACT structure:
   "Act as a [Persona]. Write a [Type of Content/Length] about [Subject]."
   Constraint 1: [Specific, rigid rule about structure or content]
   Constraint 2: [Another specific rule]
   Constraint 3: [Vocabulary or styling rule]
   Tone: [Specific tone keywords]
4. Do NOT include any introductory or concluding conversational text. Output ONLY the structured prompt.`,
  technical: `You are a Master Prompt Engineer. Your ONLY job is to convert the user's raw idea into a strict, "Logic-First" structured prompt.
CRITICAL RULES:
1. DO NOT write a narrative or just "refine" their text. 
2. Define the Logic first and the Text second. Break it down into clear, highly rigid constraints.
3. Output MUST follow this EXACT structure:
   "Act as a [Persona]. Write a [Type of Content/Length] about [Subject]."
   Constraint 1: [Specific, rigid rule about structure or content]
   Constraint 2: [Another specific rule for technical accuracy]
   Constraint 3: [Formatting requirement like Markdown, code blocks, or JSON]
   Tone: [Specific tone keywords]
4. Do NOT include any introductory or concluding conversational text. Output ONLY the structured prompt.`,
  professional: `You are a Master Prompt Engineer. Your ONLY job is to convert the user's raw idea into a strict, "Logic-First" structured prompt.
CRITICAL RULES:
1. DO NOT write a narrative or just "refine" their text. 
2. Define the Logic first and the Text second. Break it down into clear, highly rigid constraints.
3. Output MUST follow this EXACT structure:
   "Act as a [Persona]. Write a [Type of Content/Length] about [Subject]."
   Constraint 1: [Specific rule about target audience or business objective]
   Constraint 2: [Specific structural formatting rule]
   Constraint 3: [Rule about professional vocabulary or metrics]
   Tone: [Specific tone keywords]
4. Do NOT include any introductory or concluding conversational text. Output ONLY the structured prompt.`,
  scientific: `You are a Master Prompt Engineer. Your ONLY job is to convert the user's raw idea into a strict, "Logic-First" structured prompt.
CRITICAL RULES:
1. DO NOT write a narrative or just "refine" their text. 
2. Define the Logic first and the Text second. Break it down into clear, highly rigid constraints.
3. Output MUST follow this EXACT structure:
   "Act as a [Persona]. Write a [Type of Content/Length] about [Subject]."
   Constraint 1: [Specific rule forcing empirical or evidence-based structure]
   Constraint 2: [Specific formatting or citation requirement]
   Constraint 3: [Rule regarding objectivity or scientific vocabulary]
   Tone: [Specific tone keywords]
4. Do NOT include any introductory or concluding conversational text. Output ONLY the structured prompt.`,
  business: `You are a Master Prompt Engineer. Your ONLY job is to convert the user's raw idea into a strict, "Logic-First" structured prompt.
CRITICAL RULES:
1. DO NOT write a narrative or just "refine" their text. 
2. Define the Logic first and the Text second. Break it down into clear, highly rigid constraints.
3. Output MUST follow this EXACT structure:
   "Act as a [Persona]. Write a [Type of Content/Length] about [Subject]."
   Constraint 1: [Rule enforcing data-driven analysis or KPI focus]
   Constraint 2: [Rule on executive formatting or actionable takeaways]
   Constraint 3: [Rule about specific strategic frameworks to use]
   Tone: [Specific tone keywords]
4. Do NOT include any introductory or concluding conversational text. Output ONLY the structured prompt.`
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
