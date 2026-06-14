import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompts';
import { callTool } from '@/lib/mcp/client';
import type { ChatRequest } from '@/types/api';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

// ---------------------------------------------------------------------------
// Tool definitions — OpenAI reads these descriptions to decide when to call
// ---------------------------------------------------------------------------

const KAPRUKA_TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'kapruka_search_products',
      description:
        'Search products on Kapruka.com. Use whenever the user asks about specific items, wants recommendations, or needs to browse. Returns prices in LKR, stock status, and product IDs needed for ordering.',
      parameters: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Search query (e.g. "birthday cake", "roses for wife")' },
          category: { type: 'string', description: 'Category filter e.g. Birthday, Flowers, Cakes, Chocolates, Groceries, Electronics' },
          limit: { type: 'integer', description: 'Results to return (default 6, max 20)', default: 6 },
          min_price: { type: 'number', description: 'Min price in LKR' },
          max_price: { type: 'number', description: 'Max price in LKR' },
          in_stock_only: { type: 'boolean', default: false },
          sort: { type: 'string', enum: ['relevance', 'price_asc', 'price_desc', 'newest', 'bestseller'], default: 'relevance' },
        },
        required: ['q'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'kapruka_get_product',
      description: 'Get full details for a specific Kapruka product by ID — variants, images, shipping info. Use when the user wants more detail on a product from search results.',
      parameters: {
        type: 'object',
        properties: {
          product_id: { type: 'string', description: 'Kapruka product ID (e.g. "cake00ka002034")' },
        },
        required: ['product_id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'kapruka_list_categories',
      description: 'List all Kapruka product categories. Use when the user wants to explore what\'s available or asks "what can I buy?"',
      parameters: {
        type: 'object',
        properties: {
          depth: { type: 'integer', description: 'Sub-category levels (1 or 2)', default: 1 },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'kapruka_list_delivery_cities',
      description: 'Search for valid Sri Lankan city names Kapruka delivers to. Use to confirm exact city names before checking delivery or creating an order.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Partial city name (e.g. "colombo", "galle")' },
          limit: { type: 'integer', default: 10 },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'kapruka_check_delivery',
      description: 'Check if Kapruka delivers to a city on a date and get the flat delivery fee. Use when the user asks about delivery timing or cost.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'City name in Sri Lanka (e.g. "Colombo 03", "Galle")' },
          delivery_date: { type: 'string', description: 'Target date YYYY-MM-DD. Omit to check today.' },
          product_id: { type: 'string', description: 'Optional — enables perishable freshness warning for cakes/flowers' },
        },
        required: ['city'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'kapruka_create_order',
      description: 'Create a Kapruka guest-checkout order and return a click-to-pay link. Use ONLY when the user explicitly confirms they want to place an order. The link expires in 60 minutes.',
      parameters: {
        type: 'object',
        properties: {
          cart: {
            type: 'array',
            description: '1–30 items',
            items: {
              type: 'object',
              properties: {
                product_id: { type: 'string' },
                quantity: { type: 'integer', default: 1 },
                icing_text: { type: 'string', description: 'Cake icing text only' },
              },
              required: ['product_id'],
              additionalProperties: false,
            },
          },
          recipient: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              phone: { type: 'string', description: 'e.g. 077XXXXXXX or +9477XXXXXXX' },
            },
            required: ['name', 'phone'],
            additionalProperties: false,
          },
          delivery: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              city: { type: 'string', description: 'Must be a valid Kapruka delivery city' },
              date: { type: 'string', description: 'YYYY-MM-DD, today or future' },
              location_type: { type: 'string', enum: ['house', 'apartment', 'office', 'other'], default: 'house' },
              instructions: { type: 'string' },
            },
            required: ['address', 'city', 'date'],
            additionalProperties: false,
          },
          sender: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              anonymous: { type: 'boolean', default: false },
            },
            required: ['name'],
            additionalProperties: false,
          },
          gift_message: { type: 'string', description: 'Up to 300 chars' },
        },
        required: ['cart', 'recipient', 'delivery', 'sender'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'kapruka_track_order',
      description: 'Track a placed Kapruka order by order number. The order number comes from the customer\'s confirmation email (e.g. "VIMP34456CB2") — NOT from kapruka_create_order.',
      parameters: {
        type: 'object',
        properties: {
          order_number: { type: 'string', description: 'e.g. "VIMP34456CB2"' },
        },
        required: ['order_number'],
        additionalProperties: false,
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Tool execution — calls MCP and returns result as string for OpenAI
// ---------------------------------------------------------------------------

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  try {
    return await callTool(name, { params: args });
  } catch (err) {
    return `Error calling ${name}: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }
}

// ---------------------------------------------------------------------------
// Agentic loop — streams response, handles tool calls transparently
// ---------------------------------------------------------------------------

function buildMessages(request: ChatRequest): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(request.history ?? []).map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user', content: request.message },
  ];
}

export function runAgentStream(request: ChatRequest): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const messages = buildMessages(request);

        // First streaming call — OpenAI may stream text OR request tool calls
        const stream1 = await openai.chat.completions.create({
          model: MODEL,
          messages,
          tools: KAPRUKA_TOOLS,
          tool_choice: 'auto',
          stream: true,
        });

        // Accumulate tool call fragments across stream chunks
        const toolCallMap = new Map<number, { id: string; name: string; args: string }>();
        let assistantContent = '';
        let finishReason: string | null = null;

        for await (const chunk of stream1) {
          const delta = chunk.choices[0]?.delta;
          finishReason = chunk.choices[0]?.finish_reason ?? finishReason;

          if (delta?.content) {
            assistantContent += delta.content;
            controller.enqueue(encoder.encode(delta.content));
          }

          for (const tc of delta?.tool_calls ?? []) {
            const existing = toolCallMap.get(tc.index) ?? { id: '', name: '', args: '' };
            toolCallMap.set(tc.index, {
              id: tc.id ?? existing.id,
              name: tc.function?.name ?? existing.name,
              args: existing.args + (tc.function?.arguments ?? ''),
            });
          }
        }

        // No tool calls — we're done
        if (finishReason !== 'tool_calls' || toolCallMap.size === 0) {
          controller.close();
          return;
        }

        // Execute all tool calls in parallel
        const toolCalls = [...toolCallMap.entries()]
          .sort(([a], [b]) => a - b)
          .map(([, tc]) => ({
            id: tc.id,
            type: 'function' as const,
            function: { name: tc.name, arguments: tc.args },
          }));

        const toolResults = await Promise.all(
          toolCalls.map(async (tc) => {
            const args = JSON.parse(tc.function.arguments) as Record<string, unknown>;
            const content = await executeTool(tc.function.name, args);
            return { role: 'tool' as const, tool_call_id: tc.id, content };
          })
        );

        // Second call — stream the final response incorporating tool results
        const stream2 = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            ...messages,
            {
              role: 'assistant',
              content: assistantContent || null,
              tool_calls: toolCalls,
            },
            ...toolResults,
          ],
          stream: true,
        });

        for await (const chunk of stream2) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }

        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.';
        controller.enqueue(encoder.encode(`Sorry, I ran into an issue: ${msg}`));
        controller.close();
      }
    },
  });
}
