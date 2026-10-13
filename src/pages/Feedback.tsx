import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, CircleUserRound, Code2, FileText, LoaderCircle, LogOut, Paintbrush2, Sparkles, StopCircle, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { FEEDBACK_MAX_GOAL_LENGTH, FEEDBACK_MAX_WORK_LENGTH, feedbackInputIsValid, reviewPayload } from "@/lib/feedback";

const skillOptions = [
  { label: "Writing", icon: FileText, hint: "Essays, proposals, posts, and more" },
  { label: "Design", icon: Paintbrush2, hint: "Interfaces, portfolios, visual work" },
  { label: "Code", icon: Code2, hint: "Code, architecture, and projects" },
  { label: "Data", icon: Sparkles, hint: "Analysis, charts, and experiments" },
  { label: "Career", icon: CircleUserRound, hint: "CVs, interviews, and case studies" },
] as const;

type Skill = (typeof skillOptions)[number]["label"];
type AuthMode = "signin" | "signup";

const Feedback = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [skill, setSkill] = useState<Skill>("Code");
  const [goal, setGoal] = useState("");
  const [work, setWork] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUserEmail(data.session?.user.email ?? null);
        setAuthLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      setAuthMessage("");
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthMessage("");
    const result = authMode === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (result.error) {
      setAuthMessage(result.error.message);
      return;
    }
    if (authMode === "signup" && !result.data.session) {
      setAuthMessage("Check your email for a confirmation link, then come back to request feedback.");
    }
  };

  const handleGoogle = async () => {
    setAuthBusy(true);
    setAuthMessage("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setAuthMessage(result.error.message);
      setAuthBusy(false);
    }
  };

  const requestFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackInputIsValid(work, goal)) return;
    setFeedback("");
    setError("");
    setReviewing(true);
    const abortController = new AbortController();
    setController(abortController);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) throw new Error("Your session ended. Sign in again to request feedback.");
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!apiUrl || !apiKey) throw new Error("Feedback is temporarily unavailable.");

      const response = await fetch(`${apiUrl}/functions/v1/review-work`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewPayload(skill, work, goal)),
        signal: abortController.signal,
      });
      if (!response.ok) {
        let message = "We couldn’t create feedback right now. Please try again later.";
        try {
          const body = await response.json() as { error?: string };
          if (body.error) message = body.error;
        } catch { /* Keep the safe default error. */ }
        throw new Error(message);
      }
      if (!response.body) throw new Error("The review could not be read. Please try again.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const rows = buffer.split("\n");
        buffer = rows.pop() ?? "";
        for (const row of rows) {
          if (!row.trim()) continue;
          const item = JSON.parse(row) as { delta?: string; error?: string };
          if (item.error) throw new Error(item.error);
          if (item.delta) setFeedback((previous) => previous + item.delta);
        }
      }
      if (buffer.trim()) {
        const item = JSON.parse(buffer) as { delta?: string; error?: string };
        if (item.error) throw new Error(item.error);
        if (item.delta) setFeedback((previous) => previous + item.delta);
      }
    } catch (caught) {
      if (caught instanceof Error && caught.name === "AbortError") {
        setError("Review stopped.");
      } else {
        setError(caught instanceof Error ? caught.message : "We couldn’t create feedback right now. Please try again later.");
      }
    } finally {
      setReviewing(false);
      setController(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> SkillSnap
          </Link>
          {userEmail ? (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="hidden max-w-52 truncate sm:inline">{userEmail}</span>
              <Button variant="ghost" size="sm" onClick={() => void supabase.auth.signOut()} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : <span className="text-sm text-muted-foreground">Learner workspace</span>}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
            <WandSparkles className="h-4 w-4" /> SkillSnap Mentor
          </div>
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">A fresh set of eyes.<br /><span className="text-primary">A sharper next step.</span></h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Share what you’re working on. Get clear, encouraging feedback you can put to work right away.</p>
        </div>

        {authLoading ? (
          <div className="flex min-h-64 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Loading your workspace</div>
        ) : !userEmail ? (
          <section className="max-w-xl border-t border-border py-8" aria-labelledby="account-title">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Your learner account</p>
            <h2 id="account-title" className="mt-2 text-2xl font-semibold">Sign in to get feedback</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Your work is sent securely for review and isn’t saved to a history.</p>
            <div className="mt-6 flex gap-2 border-b">
              {(["signup", "signin"] as const).map((mode) => (
                <Button key={mode} type="button" variant="ghost" onClick={() => { setAuthMode(mode); setAuthMessage(""); }} aria-pressed={authMode === mode} className={authMode === mode ? "border-b-2 border-primary rounded-none text-primary" : "rounded-none text-muted-foreground"}>
                  {mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              ))}
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleAuth}>
              <label className="block text-sm font-medium">Email<Input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" /></label>
              <label className="block text-sm font-medium">Password<Input type="password" required minLength={8} autoComplete={authMode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2" /></label>
              <Button type="submit" disabled={authBusy} className="w-full sm:w-auto">{authBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{authMode === "signup" ? "Create account" : "Sign in"}<ArrowUpRight className="h-4 w-4" /></Button>
            </form>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
            <Button type="button" variant="outline" disabled={authBusy} className="w-full sm:w-auto" onClick={() => void handleGoogle()}>Continue with Google</Button>
            {authMessage && <p role="status" className="mt-4 text-sm text-muted-foreground">{authMessage}</p>}
          </section>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-14">
            <form onSubmit={requestFeedback} className="space-y-7">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">What are you working on?</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {skillOptions.map(({ label, icon: Icon, hint }) => (
                    <button key={label} type="button" onClick={() => setSkill(label)} aria-pressed={skill === label} className={`min-h-24 rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${skill === label ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
                      <Icon className={`h-5 w-5 ${skill === label ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="mt-2 block text-sm font-semibold">{label}</span>
                      <span className="mt-1 block text-xs leading-4 text-muted-foreground">{hint}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-semibold" htmlFor="goal">What would you like help with? <span className="font-normal text-muted-foreground">(optional)</span>
                <Input id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} maxLength={FEEDBACK_MAX_GOAL_LENGTH} placeholder="e.g. Make this easier to understand for a first-time user" className="mt-2" />
              </label>

              <label className="block text-sm font-semibold" htmlFor="work">Your work
                <Textarea id="work" required minLength={20} maxLength={FEEDBACK_MAX_WORK_LENGTH} value={work} onChange={(event) => setWork(event.target.value)} placeholder="Paste your draft, project description, code, or case study here…" className="mt-2 min-h-64 resize-y leading-6" />
                <span className="mt-1 flex justify-between text-xs font-normal text-muted-foreground"><span>At least 20 characters</span><span>{work.length.toLocaleString()} / {FEEDBACK_MAX_WORK_LENGTH.toLocaleString()}</span></span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" size="lg" disabled={reviewing || !feedbackInputIsValid(work, goal)}>
                  {reviewing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
                  {reviewing ? "Reviewing" : "Get feedback"}
                </Button>
                {reviewing && <Button type="button" variant="ghost" onClick={() => controller?.abort()}><StopCircle className="h-4 w-4" /> Stop</Button>}
              </div>
              <p className="text-xs leading-5 text-muted-foreground">Your submission is used to create this review and isn’t added to a saved history.</p>
            </form>

            <section className="min-h-80 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0" aria-live="polite" aria-labelledby="review-title">
              <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-primary" /><h2 id="review-title">Your feedback</h2></div>
              {!feedback && !reviewing && !error && <div className="mt-8 border-l-2 border-primary/30 pl-4"><p className="font-medium">Thoughtful. Specific. Yours.</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Your review will appear here, with what’s already working and one strong next step.</p></div>}
              {reviewing && <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin text-primary" />Taking a close look at your work…</p>}
              {feedback && <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-foreground">{feedback}</div>}
              {feedback && !reviewing && <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><Check className="h-4 w-4 text-accent" />Review complete</p>}
              {error && <p role="alert" className="mt-6 text-sm leading-6 text-destructive">{error}</p>}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Feedback;