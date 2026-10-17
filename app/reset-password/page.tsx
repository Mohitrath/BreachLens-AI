"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      router.replace("/");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not update password."); }
    finally { setBusy(false); }
  }
  return <main className="auth-reset-shell"><form className="auth-reset-card" onSubmit={submit}><div className="auth-form-icon"><ShieldCheck size={22}/></div><h1>Choose a new password</h1><p>Use at least 8 characters for your BreachLens account.</p>{error&&<div className="auth-alert">{error}</div>}<label htmlFor="new-password">New password</label><input className="auth-plain-input" id="new-password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required/><label htmlFor="confirm-password">Confirm password</label><input className="auth-plain-input" id="confirm-password" type="password" autoComplete="new-password" minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)} required/><button className="auth-submit" disabled={busy}>{busy?"Updating…":"Update password"}</button><a className="auth-back-link" href="/login">Back to sign in</a></form></main>;
}
