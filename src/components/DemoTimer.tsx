"use client";
import { useEffect, useState } from "react";

export default function DemoTimer() {
    const [remaining, setRemaining] = useState<number>(0);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [loggedOut, setLoggedOut] = useState(false);

    // Backend'den kalan süreyi düzenli çek
    useEffect(() => {
        async function fetchDemoStatus() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo-status`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (!data.active) {
                    setRemaining(0);
                    setExpiresAt(null);
                    if (!loggedOut) {
                        setLoggedOut(true);
                        // Demo bitmişse logout ve yönlendir
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                            method: "POST",
                            credentials: "include"
                        }).finally(() => window.location.href = "/");
                    }
                    return;
                }
                setRemaining(data.remaining_seconds);
                setExpiresAt(data.expires_at);
            } catch {}
        }

        fetchDemoStatus();
        const interval = setInterval(fetchDemoStatus, 10_000); // 10 sn'de bir yenile

        return () => clearInterval(interval);
        // loggedOut bağımlı olmalı ki tekrar tekrar çağrılmasın
    }, [loggedOut]);

    // Her saniye frontend'de gösterim için küçük bir timer
    useEffect(() => {
        if (!remaining) return;
        const timer = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
        return () => clearInterval(timer);
    }, [remaining]);

    if (!expiresAt || !remaining) return null;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return (
        <div className="fixed bottom-5 right-5 bg-[#18181b] px-5 py-3 rounded-xl text-white shadow-lg z-40 border border-[#8B5CF6]">
            <span className="font-semibold text-lg text-cyan-300">Demo süresi:</span>{" "}
            <span className="font-mono text-xl">{minutes}:{seconds.toString().padStart(2, "0")}</span>
        </div>
    );
}
