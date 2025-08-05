// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
            router.replace("/dashboard");
        } else {
            setError("Giriş başarısız! Bilgilerinizi kontrol edin.");
        }
    };

    return (
        <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-[#232338] p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-5">
                <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-[#8B5CF6] to-[#00fff0] bg-clip-text text-transparent mb-2">NeuroDraft Giriş</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="p-3 rounded-lg bg-[#1a1a23] text-white font-medium"
                    autoFocus
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="p-3 rounded-lg bg-[#1a1a23] text-white font-medium"
                    required
                />
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <button
                    type="submit"
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold py-2 rounded-lg shadow transition hover:scale-105"
                >
                    Giriş Yap
                </button>
            </form>
        </div>
    );
}
