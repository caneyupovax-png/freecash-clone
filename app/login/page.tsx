"use client";

import { getSupabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signUp() {
const supabase = getSupabase();
if (!supabase) return setMsg("Supabase ENV eksik (Vercel ENV) veya SSR/build.");

    setMsg(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return setMsg("HATA: " + error.message);
      setMsg("Kayıt isteği gitti ✅ (User: " + (data.user?.email ?? "null") + ")");
    } catch (e: any) {
      console.error(e);
      setMsg("CATCH HATA: " + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function signIn() {
const supabase = getSupabase();
if (!supabase) return setMsg("Supabase ENV eksik (Vercel ENV) veya SSR/build.");

    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMsg("HATA: " + error.message);
      router.push("/dashboard");
    } catch (e: any) {
      console.error(e);
      setMsg("CATCH HATA: " + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Giriş / Kayıt</h1>

      <label>Email</label>
      <input
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="mail@ornek.com"
      />

      <label>Şifre (min 6)</label>
      <input
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        type="password"
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" disabled={loading} onClick={signIn} style={{ padding: "10px 12px" }}>
          {loading ? "Bekle..." : "Giriş Yap"}
        </button>
        <button type="button" disabled={loading} onClick={signUp} style={{ padding: "10px 12px" }}>
          {loading ? "Bekle..." : "Kayıt Ol"}
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
