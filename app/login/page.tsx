"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [callbackError, setCallbackError] = useState(false);
  useEffect(() => { setCallbackError(new URLSearchParams(window.location.search).get("error") === "callback"); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    if (!configured) { setError("Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your local .env.local and Vercel environment variables."); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        router.replace("/");
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        });
        if (error) throw error;
        if (data.session) { router.replace("/"); router.refresh(); }
        else setMessage("Account created. Check your inbox for the confirmation link, then return here to sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
        });
        if (error) throw error;
        setMessage("If an account exists for this email, a password-reset link has been sent.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed. Please try again.");
    } finally { setBusy(false); }
  }

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";
  const subtitle = mode === "login" ? "Sign in to continue to your security workspace." : mode === "signup" ? "Set up your private BreachLens workspace." : "We'll email you a secure password-reset link.";

  return <main className="auth-shell">
    <section className="auth-visual">
      <div className="auth-brand"><span className="auth-logo"><ShieldCheck size={22}/></span><span>BreachLens<span className="auth-green"> AI</span><small>SECURITY INTELLIGENCE</small></span></div>
      <div className="auth-hero"><div className="auth-eyebrow"><Activity size={14}/> EXPLAINABLE SECURITY TRIAGE</div><h1>See the signal.<br/><span>Stop the breach.</span></h1><p>Bring security events into focus with evidence-linked findings, transparent risk scores, and analyst-guided response.</p>
        <div className="auth-points"><div><ShieldCheck size={17}/><span><b>Evidence first</b><small>Every finding is grounded in observable event patterns.</small></span></div><div><LockKeyhole size={17}/><span><b>{configured ? "Private workspace" : "Public demo workspace"}</b><small>{configured ? "Sign-in is required before accessing the dashboard." : "Explore the dashboard without creating an account. Demo mode is not private or access-controlled."}</small></span></div></div>
      </div>
      <div className="auth-visual-foot">DEFENSIVE SECURITY · HUMAN-VERIFIED RESPONSE</div>
    </section>
    <section className="auth-form-side"><div className="auth-form-wrap">
      <div className="auth-mobile-brand"><ShieldCheck size={20}/> BreachLens<span className="auth-green"> AI</span></div>
      <div className="auth-form-head"><div className="auth-form-icon"><LockKeyhole size={19}/></div><h2>{title}</h2><p>{subtitle}</p></div>
      {!configured && <div className="auth-success">Demo mode is ready. You can explore the dashboard without configuring Supabase. This public demo does not provide account security or private user data.</div>}
      {callbackError && <div className="auth-alert">The confirmation link could not be verified or has expired. Request a new link and try again.</div>}
      {message && <div className="auth-success">{message}</div>}
      {error && <div className="auth-alert">{error}</div>}
      {!configured ? <button className="auth-submit auth-demo-button" type="button" onClick={() => { router.replace("/"); router.refresh(); }}>Continue to public demo <ArrowRight size={16}/></button> : <form className="auth-form" onSubmit={submit}>
        <label htmlFor="email">Email address</label><div className="auth-input-wrap"><Mail size={16}/><input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        {mode !== "forgot" && <><label htmlFor="password">Password</label><div className="auth-input-wrap"><LockKeyhole size={16}/><input id="password" type={showPassword?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"} placeholder={mode==="signup"?"At least 8 characters":"Enter your password"} minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="auth-eye" aria-label={showPassword?"Hide password":"Show password"} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></>}
        {mode === "login" && <button type="button" className="auth-text-button auth-forgot" onClick={()=>{setMode("forgot");setError("");setMessage("");}}>Forgot password?</button>}
        <button className="auth-submit" type="submit" disabled={busy || !configured}>{busy ? "Please wait…" : mode==="login" ? "Sign in securely" : mode==="signup" ? "Create account" : "Send reset link"} <ArrowRight size={16}/></button>
      </form>
      <div className="auth-switch">{mode==="login" ? <>New to BreachLens? <button onClick={()=>{setMode("signup");setError("");setMessage("");}}>Create an account</button></> : mode==="signup" ? <>Already registered? <button onClick={()=>{setMode("login");setError("");setMessage("");}}>Sign in</button></> : <>Remembered your password? <button onClick={()=>{setMode("login");setError("");setMessage("");}}>Back to sign in</button></>}</div>
      <div className="auth-security-note"><LockKeyhole size={14}/> Sessions are verified server-side. Never share your password or API keys.</div>
    </div></section>
  </main>;
}
