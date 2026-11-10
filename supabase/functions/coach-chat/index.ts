import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";
const MAX_COMPLETION_TOKENS = 600;
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2000;
const RATE_LIMIT_PER_HOUR = 30;
const SYSTEM_PROMPT =
  "You are Athlatai's AI sports coach. Answer the athlete's latest question directly and specifically, using the earlier messages for context. Do not repeat advice already given in this conversation unless the athlete asks; build on it instead. Keep answers short and practical. For injuries or medical concerns, recommend a qualified professional.";

type ChatTurn = { role: "user" | "assistant"; content: string };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseMessages(input: unknown): ChatTurn[] | { error: string } {
  if (!Array.isArray(input) || input.length === 0) {
    return { error: "Send at least one message." };
  }
  const turns: ChatTurn[] = [];
  for (const item of input.slice(-MAX_HISTORY_MESSAGES)) {
    if (!item || (item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") {
      return { error: "Invalid message format." };
    }
    const content = item.content.trim();
    if (!content) return { error: "Messages cannot be empty." };
    if (content.length > MAX_MESSAGE_CHARS) {
      return { error: `Messages are limited to ${MAX_MESSAGE_CHARS} characters.` };
    }
    turns.push({ role: item.role, content });
  }
  if (turns[turns.length - 1].role !== "user") {
    return { error: "The last message must be from you." };
  }
  return turns;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Please sign in to use the AI Coach." }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) {
      return json({ error: "Your session has expired. Please sign in again." }, 401);
    }
    const userId = userData.user.id;

    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) return json({ error: "The AI Coach is not configured yet." }, 503);

    const body = await req.json().catch(() => null);
    const messages = parseMessages(body?.messages);
    if (!Array.isArray(messages)) return json({ error: messages.error }, 400);

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { error: insertError } = await admin.from("coach_usage").insert({ user_id: userId });
    if (insertError) throw insertError;

    const { count, error: countError } = await admin
      .from("coach_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) > RATE_LIMIT_PER_HOUR) {
      return json({ error: "You have reached the hourly limit for the AI Coach. Please try again later." }, 429);
    }

    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        reasoning_effort: "low",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (groqResponse.status === 429) {
      return json({ error: "The AI Coach is busy right now. Please wait a moment and try again." }, 429);
    }
    if (!groqResponse.ok) {
      console.error("Groq request failed", groqResponse.status);
      return json({ error: "The AI Coach could not respond. Please try again." }, 502);
    }

    const payload = await groqResponse.json();
    const reply = payload?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return json({ error: "The AI Coach returned an empty reply. Please try again." }, 502);
    }

    return json({ reply: reply.trim() });
  } catch (err) {
    console.error("coach-chat failed", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
