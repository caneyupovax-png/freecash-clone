"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function Page() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6 && !loading;
  }, [email, password, loading]);

  async function handleSubmit() {
    const supabase = getSupabase();
    if (!supabase) return setMsg("Supabase ENV eksik.");

    setMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) return setMsg(error.message);
        setMsg("Kayıt alındı ✅ (Email doğrulama açıksa mailine link gelir.)");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setMsg(error.message);
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070A14] text-white">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur md:grid-cols-2">
          {/* LEFT: brand/benefits (Freecash vibe) */}
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight">Hedimax</div>
                <div className="text-sm text-white/60">Earn rewards by completing offers.</div>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <Feature title="Fast payouts" desc="Test için basit puan sistemi; sonra withdraw ekleriz." />
              <Feature title="Trusted offers" desc="Görev listesi → tamamla → puan kazan." />
              <Feature title="Secure login" desc="Supabase Auth ile email/şifre giriş." />
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm text-white/60">Demo flow</div>
              <div className="mt-2 text-sm text-white/80">
                Login → Dashboard → Offers → Points → Withdraw
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Offers", "Wallet", "Bonuses", "Leaderboard"].map((x) => (
                  <span
                    key={x}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 text-xs text-white/35">
              Hedimax © {new Date().getFullYear()} — By continuing you agree to our terms.
            </div>
          </div>

          {/* RIGHT: auth card */}
          <div className="p-8 md:p-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                {mode === "signin" ? "Sign in" : "Create account"}
              </h1>

              <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={
                    "rounded-xl px-3 py-1.5 text-sm transition " +
                    (mode === "signin"
                      ? "bg-white text-slate-950"
                      : "text-white/70 hover:text-white")
                  }
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={
                    "rounded-xl px-3 py-1.5 text-sm transition " +
                    (mode === "signup"
                      ? "bg-white text-slate-950"
                      : "text-white/70 hover:text-white")
                  }
                >
                  Sign up
                </button>
              </div>
            </div>

            <p className="mt-2 text-sm text-white/60">
              {mode === "signin"
                ? "Welcome back. Earn rewards in minutes."
                : "Create your account to start earning."}
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">Email</label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/25"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Password</label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/25"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
                <div className="mt-2 text-xs text-white/40">
                  Tip: Test için 6+ karakter kullan.
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={
                  "group w-full rounded-2xl px-4 py-3 text-sm font-semibold transition " +
                  (canSubmit
                    ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 hover:opacity-95"
                    : "cursor-not-allowed bg-white/10 text-white/40")
                }
              >
                {loading ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
              </button>

              {msg && (
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/85">
                  {msg}
                </div>
              )}

              <div className="pt-2 text-center text-xs text-white/45">
                {mode === "signin" ? (
                  <span>
                    No account?{" "}
                    <button
                      type="button"
                      className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white"
                      onClick={() => setMode("signup")}
                    >
                      Sign up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white"
                      onClick={() => setMode("signin")}
                    >
                      Sign in
                    </button>
                  </span>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/60">Next</div>
                <div className="mt-1 text-sm text-white/80">
                  Offers sayfası + puan cüzdanı tasarımını da aynı stile çeviriyoruz.
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-white/35">
              Protected by Supabase Auth.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="mt-1 text-sm text-white/60">{desc}</div>
    </div>
  );
}
