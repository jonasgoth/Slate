import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return Response.json({ tasks: [] });
  }

  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({ tasks: z.array(z.string()) }),
    prompt: `Extract individual actionable tasks from this brain dump text.
Rules:
- Split compound items ("call dentist and buy groceries" → two tasks)
- Normalize to sentence case
- Remove filler phrases like "I need to", "don't forget to", "remember to", "I should", "I have to"
- Deduplicate near-identical items
- Return only the task titles, nothing else
- If the input is already a list, clean up each item

Brain dump:
${text}`,
  });

  return Response.json(object);
}
