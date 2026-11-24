# Project memory

## Product intent & audience

- AthleteAI: sports training platform with AI coaching, training preferences, and nutrition tracking.
- Mobile app built with Expo (React Native); backend on Supabase (profiles table, edge functions).
- Target users: athletes wanting personalized AI coaching and meal/nutrition logging.

## Brand personality & voice

- Production-quality, polished, not cookie-cutter (per `.bolt/prompt`).
- Communication style: direct, user-facing error messages; technical details hidden from chat UI.

## Visual design & UX direction

- `.bolt/prompt` specifies JSX + Tailwind, React hooks, lucide-react icons; no extra UI/icon packages unless necessary.
- Chat UI hides structured data (meal details) from visible messages; surfaces action buttons instead.
- Nutrition entry: prefilled form with estimate label; user must confirm before saving — no silent saves.
- Profile/Settings screens show visible error states on save failure rather than feigning success.

## Decisions, constraints & rationale

- Database columns use snake_case: `created_at`, `updated_at` — must match exactly in all DB writes.
- Sign-up flow decouples account creation from profile save: if profile save fails, account still exists; user is told to finish profile in Settings. No duplicate accounts.
- Settings page reuses same profile-save logic and column names; visible error on failure.
- AI Coach edge function receives only relevant training-preference fields (goals, sports, skill level, equipment, weekly schedule); nothing sent if preferences empty.
- AI Coach returns structured meal details (name + calorie estimate) when suggesting a meal; client uses that to reliably show "Add to Nutrition" button and prefill existing food form.
- Reuse existing preference-loading logic and existing nutrition form — no new components for this task.
- Redesign explicitly deferred to a separate task; edits were focused fixes only.

## Open questions & assumptions

- Live app testing still needed: (1) new user's name persists after refresh, (2) AI Coach reply reflects saved preferences, (3) Add to Nutrition opens prefilled form and saves on confirm.
- Type check, production build, and coach function deployment all passed; runtime behavior in the app not yet verified.
- Assumed Supabase profile schema has `created_at`, `updated_at`, and profile fields matching what the app writes.