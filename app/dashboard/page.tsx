"use client";
import { getSupabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    useEffect(() => {
  const supabase = getSupabase();
  if (!supabase) return;

  supabase.auth.getUser().then(({ data }) => {
    const e = data.user?.email ?? null;
    if (!e) router.push("/login");
    else setEmail(e);
  });
}, [router]);
  async function signOut() {
    const supabase = getSupabase();
if (!supabase) return;
await supabase.auth.signOut();

  }

  return (
    <div style={{ maxWidth: 720, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Dashboard</h1>
      <p>Giriş yapan: {email ?? "..."}</p>
      <button onClick={signOut} style={{ marginTop: 12, padding: "10px 12px" }}>
        Çıkış Yap
      </button>
    </div>
  );
}
