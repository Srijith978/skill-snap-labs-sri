import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";
import { z } from "npm:zod";
import { getAuthenticatedUser } from "../_shared/auth.ts";
import { getLovableAiGatewayRunId, getLovableAiGatewayResponseHeaders } from "../_shared/run-id.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};

const bodySchema = z.object({
  skill: z.enum(["Writing", "Design", "Code", "Data", "Career"]),
  work: z.string().trim().min(20).max(12_000),
  goal: z.string().trim().max(600),
}).strict();

const gatewayUrl = "https://ai.gateway.lovable.dev/v1";
const defaultError = "We couldn’t create feedback right now. Please try again later.";

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isProviderDenial(status: number, type: unknown) {
  return status === 403 && type !== "credit_limit_reached" && type !== "model_vendor_not_enabled" && type !== "model_requires_retention_consent" && type !== "provider_not_available_in_region";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonError("Method not allowed", 405);

  const user = await getAuthenticatedUser(request);
  if (!user) return jsonError("Please sign in to request feedback.", 401);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Please provide work for feedback.", 400);
  }
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) return jsonError("Check the skill area and work text, then try again.", 400);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  const databaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !databaseUrl || !serviceRoleKey) return jsonError("Feedback is temporarily unavailable.", 500);

  const { createClient } = await import("npm:@supabase/supabase-js@2");
  const admin = createClient(databaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: pause, error: pauseReadError } = await admin
    .from("ai_gateway_workspace_pause")
    .select("message")
    .eq("scope", "workspace")
    .maybeSingle();
  if (pauseReadError) return jsonError("Feedback is temporarily unavailable.", 500);
  if (pause) return jsonError(pause.message || defaultError, 503);

  const runId = getLovableAiGatewayRunId(request);
  const runIdHeader = "X-Lovable-AIG-Run-ID";
  const fetchWithRunId: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(runIdHeader)) headers.set(runIdHeader, runId);
    return fetch(input, { ...init, headers });
  };
  const provider = createOpenAI({
    baseURL: gatewayUrl,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: fetchWithRunId,
  });

  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      abortSignal: request.signal,
      instructions: "You are SkillSnap Mentor, a warm, candid expert coach. Give specific, actionable feedback on the submitted work. Be encouraging but honest. Never claim to have run code or verified anything you did not inspect. Structure feedback with a short overall read, what is working, the highest-impact improvements, and a concrete next step. Keep it concise and tailored to the chosen skill and stated goal.",
      messages: [{
        role: "user",
        content: `Skill area: ${parsed.data.skill}\nGoal: ${parsed.data.goal || "No specific goal provided"}\n\nWork to review:\n${parsed.data.work}`,
      }],
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        const reader = result.textStream.getReader();
        let received = false;
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            received = true;
            controller.enqueue(encoder.encode(JSON.stringify({ delta: value }) + "\n"));
          }
          if (!received) controller.enqueue(encoder.encode(JSON.stringify({ error: "The review returned no feedback. Please try again." }) + "\n"));
          controller.close();
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            controller.close();
            return;
          }
          const message = error instanceof Error ? error.message : "";
          const statusMatch = message.match(/(?:status|statusCode)[^0-9]*(\d{3})/i);
          const status = statusMatch?.[1] ? Number(statusMatch[1]) : 0;
          const providerDenial = status === 403 && /provider|access|denied|permission|refus/i.test(message) && !/credit_limit_reached|model_vendor_not_enabled|model_requires_retention_consent|provider_not_available_in_region/i.test(message);
          if (providerDenial) {
            const safeMessage = defaultError;
            const { error: pauseWriteError } = await admin.from("ai_gateway_workspace_pause").upsert({
              scope: "workspace",
              status_code: 403,
              message: safeMessage,
            });
            if (pauseWriteError) console.error("Could not persist AI provider denial pause");
          }
          controller.enqueue(encoder.encode(JSON.stringify({ error: defaultError }) + "\n"));
          controller.close();
        }
      },
      cancel() {
        request.signal.throwIfAborted();
      },
    });

    const responseHeaders = getLovableAiGatewayResponseHeaders(undefined, {
      ...corsHeaders,
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    });
    const response = new Response(stream, { headers: responseHeaders });
    const returnedRunId = runId;
    if (returnedRunId) response.headers.set(runIdHeader, returnedRunId);
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return new Response(null, { status: 499, headers: corsHeaders });
    const message = error instanceof Error ? error.message : "";
    const statusMatch = message.match(/(?:status|statusCode)[^0-9]*(\d{3})/i);
    const status = statusMatch?.[1] ? Number(statusMatch[1]) : 0;
    const providerDenial = isProviderDenial(status, message.match(/model_vendor_not_enabled|model_requires_retention_consent|provider_not_available_in_region|credit_limit_reached/)?.[0]);
    if (providerDenial) {
      const { error: pauseWriteError } = await admin.from("ai_gateway_workspace_pause").upsert({ scope: "workspace", status_code: status, message: defaultError });
      if (pauseWriteError) console.error("Could not persist AI provider denial pause");
    }
    return jsonError(defaultError, status === 429 ? 429 : status >= 500 ? 503 : 500);
  }
});