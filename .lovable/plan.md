# Live learner feedback

## Build
- Add a focused “Get feedback” workspace to SkillSnap where signed-in learners choose a skill area, paste work, optionally describe their goal, and request actionable review.
- Require a Cloud account before AI review so submissions and shared AI usage are protected. Provide email sign-in/sign-up and a clear signed-out state; do not save submissions or feedback.
- Generate feedback through a Cloud Edge Function using Lovable AI, with input limits, authenticated-user validation, safe errors, and streamed upstream generation.
- Keep the new experience visually aligned with SkillSnap’s existing theme and usable on small screens.

## Technical details
- Create a small React feedback page/component and a dedicated Supabase Edge Function; call it with the existing Cloud client.
- Use the gateway’s Responses API with the default `openai/gpt-6-astra` model; keep the API key and prompt server-side.
- No database tables, feedback history, or persistent submission storage in this version.
- Verify the build, function behavior, and the signed-in review flow where an available session permits it.
