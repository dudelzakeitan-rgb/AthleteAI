import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";
const MAX_COMPLETION_TOKENS = 1500;

interface Exercise {
  name: string;
  type: "strength" | "mobility" | "core" | "sport" | "cardio";
  sets: number;
  reps: string;
  duration?: string;
  rest: string;
  description: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Please sign in to generate workouts." }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) {
      return json({ error: "Your session has expired. Please sign in again." }, 401);
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) return json({ error: "Workout generation is not configured yet." }, 503);

    const body = await req.json().catch(() => null);
    const sport = typeof body?.sport === "string" ? body.sport.trim().slice(0, 80) : "";
    const goal = typeof body?.goal === "string" ? body.goal.trim().slice(0, 80) : "";
    if (!sport || !goal) return json({ error: "Choose a sport and a goal first." }, 400);

    const prefs = body?.preferences && typeof body.preferences === "object" ? body.preferences : {};
    const str = (v: unknown, max: number) =>
      typeof v === "string" ? v.trim().slice(0, max) : "";
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(Math.max(Math.round(v), 1), 300) : null);
    const arr = (v: unknown) =>
      Array.isArray(v) ? v.filter((x) => typeof x === "string").map((x) => x.slice(0, 40)).slice(0, 10) : [];

    const skillLevel = str(prefs.skillLevel, 40) || "intermediate";
    const sessionsPerWeek = num(prefs.sessionsPerWeek) ?? 3;
    const sessionMinutes = num(prefs.sessionMinutes) ?? 60;
    const equipment = arr(prefs.equipment);
    const notes = str(prefs.notes, 300);

    const system =
      "You are a certified sports coach. Return ONLY valid JSON, no markdown fences, matching exactly: " +
      '{"exercises":[{"name":string,"type":"strength"|"mobility"|"core"|"sport"|"cardio","sets":number,"reps":string,"duration":string,"rest":string,"description":string}]}. ' +
      "Include 6-10 exercises ordered as a session: warm-up, main work, cooldown. Use reps for strength work and duration for timed work. Keep descriptions to one sentence.";

    const userPrompt =
      `Create one workout session. Sport: ${sport}. Goal: ${goal}. Experience: ${skillLevel}. ` +
      `Session length: ${sessionMinutes} minutes (they train ${sessionsPerWeek}x per week). ` +
      (equipment.length ? `Available equipment: ${equipment.join(", ")}. ` : "No equipment, bodyweight only. ") +
      (notes ? `Extra context from the athlete: ${notes}.` : "");

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
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (groqResponse.status === 429) {
      return json({ error: "The workout generator is busy right now. Please wait a moment and try again." }, 429);
    }
    if (!groqResponse.ok) {
      console.error("Groq request failed", groqResponse.status);
      return json({ error: "The workout generator could not respond. Please try again." }, 502);
    }

    const payload = await groqResponse.json();
    const raw = payload?.choices?.[0]?.message?.content;
    if (typeof raw !== "string" || !raw.trim()) {
      return json({ error: "The workout generator returned an empty response. Please try again." }, 502);
    }

    let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) cleaned = cleaned.slice(start, end + 1);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return json({ error: "The workout generator returned an unreadable response. Please try again." }, 502);
    }

    const exercises = (parsed as { exercises?: unknown })?.exercises;
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return json({ error: "The workout generator returned no exercises. Please try again." }, 502);
    }

    const valid: Exercise[] = [];
    for (const item of exercises.slice(0, 12)) {
      const ex = item as Partial<Exercise>;
      if (typeof ex?.name !== "string" || !ex.name.trim()) continue;
      const type = ["strength", "mobility", "core", "sport", "cardio"].includes(ex.type ?? "")
        ? (ex.type as Exercise["type"])
        : "sport";
      valid.push({
        name: ex.name.trim().slice(0, 120),
        type,
        sets: typeof ex.sets === "number" && Number.isFinite(ex.sets) ? Math.min(Math.max(Math.round(ex.sets), 1), 10) : 3,
        reps: typeof ex.reps === "string" ? ex.reps.trim().slice(0, 40) || "10" : "10",
        duration: typeof ex.duration === "string" ? ex.duration.trim().slice(0, 40) : undefined,
        rest: typeof ex.rest === "string" ? ex.rest.trim().slice(0, 40) : "60s",
        description: typeof ex.description === "string" ? ex.description.trim().slice(0, 300) : "",
      });
    }
    if (valid.length === 0) {
      return json({ error: "The workout generator returned no usable exercises. Please try again." }, 502);
    }

    return json({ exercises: valid });
  } catch (err) {
    console.error("workout-generator failed", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
