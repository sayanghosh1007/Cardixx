import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { method, input, count = 10 } = await req.json();
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let userPrompt = '';
    switch (method) {
      case 'topic':
        userPrompt = `Gather accurate knowledge and create ${count} high-quality study flashcards about the topic: "${input}". Cover key definitions, principles, examples, and common pitfalls.`;
        break;
      case 'notes':
        userPrompt = `Create ${count} flashcards from these notes. Extract the most important facts and concepts:\n\n${input}`;
        break;
      case 'url':
        userPrompt = `Create ${count} flashcards summarizing the likely content at this URL based on its domain and path: ${input}. Use your knowledge of the source if known.`;
        break;
      default:
        userPrompt = `Create ${count} general study flashcards about: ${input}`;
    }

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert tutor that creates accurate, concise study flashcards. Always respond by calling the provided function.' },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'return_flashcards',
            description: 'Return the generated flashcards',
            parameters: {
              type: 'object',
              properties: {
                cards: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      question: { type: 'string' },
                      answer: { type: 'string' },
                    },
                    required: ['question', 'answer'],
                  },
                },
              },
              required: ['cards'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'return_flashcards' } },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: 'AI error', detail: text }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = args ? JSON.parse(args) : { cards: [] };

    return new Response(JSON.stringify({ cards: parsed.cards || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
