"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      const e = data.user?.email ?? null;
      if (!e) router.push("/login");
      else setEmail(e);
      setLoading(false);
    });
  }, [router]);

  async function signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-white/60">
              Hesap:{" "}
              <span className="text-white/90">
                {loading ? "yükleniyor..." : email ?? "—"}
              </span>
            </p>
          </div>

          <button
            onClick={signOut}
            className="w-fit rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Çıkış Yap
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">Puan</div>
            <div className="mt-2 text-3xl font-semibold">0</div>
            <div className="mt-2 text-xs text-white/40">
              Bir sonraki adımda puanları Supabase’ten çekeceğiz.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
            <div className="text-sm text-white/60">Hızlı Başlangıç</div>
            <div className="mt-2 text-base font-medium">Görev listesi ekleyelim</div>
            <div className="mt-2 text-sm text-white/60">
              Basit görevler → tamamla → puan kazan. Sonra withdraw ekranı.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                Offer list
              </span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                Points wallet
              </span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                Withdraw requests
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/0 p-6">
          <div className="text-sm text-white/60">Sonraki adım</div>
          <div className="mt-2 text-lg font-semibold">
            Puan sistemi + görevler (FreeCash mantığı)
          </div>
          <div className="mt-2 text-sm text-white/60">
            İstersen bir sonraki adımda: Supabase’te <b>profiles</b> tablosu açıp her kullanıcıya otomatik{" "}
            <b>0 puan</b> verelim.
          </div>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-white/90"
          >
            Login sayfasını gör
          </button>
        </div>
      </div>
    </div>
  );
}
