'use client';

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, XCircle, PlayCircle } from "lucide-react";

// Giriş yaptıysa doğrudan dashboard’a at
if (typeof window !== "undefined") {
    if (document.cookie.includes("access_token")) {
        window.location.href = "/dashboard";
    }
}

type AuthStep = "login" | "register" | "register_code";

export default function LandingPage() {
    // Auth tab state
    const [tab, setTab] = useState<AuthStep>("login");

    // Register state
    const [regEmail, setRegEmail] = useState("");
    const [regName, setRegName] = useState("");
    const [regPass, setRegPass] = useState("");
    const [regCode, setRegCode] = useState("");
    const [canResend, setCanResend] = useState(false);

    // Login state
    const [logEmail, setLogEmail] = useState("");
    const [logPass, setLogPass] = useState("");

    // Forgot password state
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [resetNewPass, setResetNewPass] = useState("");
    const [resetStep, setResetStep] = useState<0 | 1>(0);

    // UI
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    // Demo Login
    const handleDemoLogin = async () => {
        setLoading(true); setError(""); setMsg("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: "demo@neurodraft.com", password: "demodraft" }),
        });
        setLoading(false);
        if (res.ok) {
            setMsg("Demo giriş başarılı, yönlendiriliyorsunuz...");
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 800);
        } else {
            setError("Demo hesabı kullanılamıyor. Lütfen kaydolun!");
        }
    };

    // --- Register Akışı ---
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); setError(""); setMsg("");
        if (regPass.length < 8) {
            setLoading(false);
            setError("Şifre en az 8 karakter olmalı!");
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: regEmail,
                full_name: regName,
                password: regPass
            })
        });
        setLoading(false);
        if (res.ok) {
            setTab("register_code");
            setMsg("Onay kodu mail adresine gönderildi. Kodu giriniz:");
            setCanResend(false);
            setTimeout(() => setCanResend(true), 60_000); // 1 dk sonra tekrar gönderebilir
        } else {
            const d = await res.json();
            setError(d.detail || "Kayıt başarısız!");
        }
    };

    const handleVerify = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); setError(""); setMsg("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: regEmail,
                code: regCode
            })
        });
        setLoading(false);
        if (res.ok) {
            setMsg("E-posta doğrulandı! Şimdi giriş yapabilirsiniz.");
            setTab("login");
        } else {
            const d = await res.json();
            setError(d.detail || "Kod hatalı veya süresi geçti!");
            setCanResend(true);
        }
    };

    // Onay kodunu tekrar gönder
    const resendCode = async () => {
        setLoading(true); setError(""); setMsg("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resend-verify-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: regEmail })
        });
        setLoading(false);
        if (res.ok) {
            setMsg("Yeni onay kodu gönderildi! Gelen kutunuzu kontrol edin.");
            setCanResend(false);
            setTimeout(() => setCanResend(true), 60_000);
        } else {
            setError("Kod tekrar gönderilemedi. Lütfen daha sonra tekrar deneyin.");
        }
    };

    // --- Login ---
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); setError(""); setMsg("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: logEmail, password: logPass }),
        });
        setLoading(false);
        if (res.ok) {
            setMsg("Giriş başarılı, yönlendiriliyorsunuz...");
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 800);
        } else {
            setError("E-mail veya şifre hatalı!");
        }
    };

    // --- Şifremi Unuttum ---
    const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); setError(""); setMsg("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: forgotEmail })
        });
        setLoading(false);
        if (res.ok) {
            setResetStep(1);
            setMsg("Kod mailine gönderildi. Kodu ve yeni şifreni gir:");
        } else {
            setError("Mail adresi bulunamadı!");
        }
    };

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); setError(""); setMsg("");
        if (resetNewPass.length < 8) {
            setLoading(false);
            setError("Yeni şifre en az 8 karakter olmalı!");
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: forgotEmail,
                code: resetCode,
                new_password: resetNewPass
            })
        });
        setLoading(false);
        if (res.ok) {
            setMsg("Şifre başarıyla değiştirildi! Şimdi giriş yapabilirsiniz.");
            setShowForgot(false); setResetStep(0); setForgotEmail(""); setResetCode(""); setResetNewPass("");
        } else {
            setError("Kod veya şifre hatalı!");
        }
    };

    // Landing sayfası...
    return (
        <div className="min-h-screen bg-[#18181b] text-white font-sans flex flex-col">
            {/* HERO */}
            <section className="w-full flex flex-col items-center justify-center py-20 px-3 bg-gradient-to-br from-[#18181b] via-[#222a38] to-[#101013]">
                <Image src="/logo.png" alt="NeuroDraft Logo" width={110} height={110} className="mx-auto mb-6 drop-shadow-[0_8px_32px_rgba(40,200,255,0.45)]" priority />
                <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, type: "spring" }} className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] bg-clip-text text-transparent mb-4 text-center">
                    NeuroDraft ile Akıllı Not Yönetimi
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="max-w-2xl text-lg text-gray-300 text-center mb-10">
                    Yapay zekâ destekli, modern ve hızlı SaaS platformu.<br />
                    Tüm notlarını organize et, özetle, istediğin yerde eriş!
                </motion.p>

                {/* AUTH CARD */}
                <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, type: "spring" }} className="bg-[#232338] bg-opacity-95 rounded-2xl shadow-2xl p-7 mx-auto max-w-md w-full">
                    {/* TABLAR */}
                    <div className="flex justify-center mb-6">
                        <button onClick={() => { setTab("login"); setError(""); setMsg(""); }} className={`px-5 py-2 rounded-t-lg font-bold text-lg transition ${tab === "login" ? "bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white shadow" : "bg-[#1a1a23] text-gray-400"}`}>Giriş Yap</button>
                        <button onClick={() => { setTab("register"); setError(""); setMsg(""); }} className={`px-5 py-2 rounded-t-lg font-bold text-lg transition ${tab === "register" || tab === "register_code" ? "bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white shadow" : "bg-[#1a1a23] text-gray-400"}`}>Kayıt Ol</button>
                    </div>
                    {/* --- FORMLAR --- */}
                    <AnimatePresence mode="wait">
                        {tab === "login" && (
                            <motion.form key="login"
                                         initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.28 }}
                                         onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-[#8B5CF6]" size={20} />
                                    <input type="email" value={logEmail} autoComplete="email" onChange={e => setLogEmail(e.target.value)} placeholder="Email" className="bg-[#1a1a23] text-white pl-10 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#8B5CF6]" required aria-label="Email" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-[#06B6D4]" size={20} />
                                    <input type="password" value={logPass} autoComplete="current-password" onChange={e => setLogPass(e.target.value)} placeholder="Şifre" className="bg-[#1a1a23] text-white pl-10 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#06B6D4]" required aria-label="Şifre" />
                                </div>
                                <div className="text-right text-sm">
                                    <button type="button" onClick={() => { setShowForgot(true); setError(""); setMsg(""); }} className="text-cyan-400 hover:underline">Şifremi Unuttum?</button>
                                </div>
                                <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit" className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white font-bold py-3 rounded-xl transition text-lg mt-2 shadow-lg">{loading ? "Giriş..." : "Giriş Yap"}</motion.button>
                                <button type="button" disabled={loading} onClick={handleDemoLogin} className="flex items-center gap-2 justify-center border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-xl py-2 mt-2 font-bold transition"><PlayCircle /> Demo Giriş</button>
                            </motion.form>
                        )}
                        {tab === "register" && (
                            <motion.form key="register"
                                         initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.28 }}
                                         onSubmit={handleRegister} className="flex flex-col gap-5 w-full">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-[#8B5CF6]" size={20} />
                                    <input type="email" value={regEmail} autoComplete="email" onChange={e => setRegEmail(e.target.value)} placeholder="Email" className="bg-[#1a1a23] text-white pl-10 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#8B5CF6]" required aria-label="Email" />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-[#06B6D4]" size={20} />
                                    <input type="text" value={regName} autoComplete="name" onChange={e => setRegName(e.target.value)} placeholder="Ad Soyad" className="bg-[#1a1a23] text-white pl-10 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#06B6D4]" required aria-label="Ad Soyad" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-[#8B5CF6]" size={20} />
                                    <input type="password" value={regPass} autoComplete="new-password" onChange={e => setRegPass(e.target.value)} placeholder="Şifre (min 8 karakter)" className="bg-[#1a1a23] text-white pl-10 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#8B5CF6]" required aria-label="Şifre" />
                                </div>
                                <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit" className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white font-bold py-3 rounded-xl transition text-lg mt-2 shadow-lg">{loading ? "Kayıt..." : "Kayıt Ol"}</motion.button>
                            </motion.form>
                        )}
                        {tab === "register_code" && (
                            <motion.form key="register_code"
                                         initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.28 }}
                                         onSubmit={handleVerify} className="flex flex-col gap-5 w-full">
                                <input type="text" value={regCode} onChange={e => setRegCode(e.target.value)} placeholder="Mail kodunu giriniz" className="bg-[#1a1a23] text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-[#8B5CF6] text-center" required maxLength={6} />
                                <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit" className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white font-bold py-3 rounded-xl transition text-lg shadow-lg">{loading ? "Doğrulanıyor..." : "Kodu Onayla"}</motion.button>
                                <button type="button" className={`mt-1 text-xs text-cyan-300 underline disabled:opacity-40`} disabled={!canResend || loading} onClick={resendCode}>
                                    Kodu Tekrar Gönder {canResend ? "" : "(60 sn)"}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                    {/* Mesajlar */}
                    {(msg || error) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 text-center w-full">
                            {msg && <div className="text-green-400 font-semibold">{msg}</div>}
                            {error && <div className="text-[#F47174] font-semibold">{error}</div>}
                        </motion.div>
                    )}
                </motion.div>

                {/* ŞİFREMİ UNUTTUM MODAL */}
                <AnimatePresence>
                    {showForgot && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                            <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 20 }} transition={{ type: "spring" }} className="bg-[#232338] rounded-xl shadow-2xl p-8 w-full max-w-sm relative">
                                <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => { setShowForgot(false); setError(""); setMsg(""); setResetStep(0); }}>
                                    <XCircle size={28} />
                                </button>
                                <h2 className="text-xl font-bold mb-4 text-cyan-400">Şifremi Unuttum</h2>
                                {resetStep === 0 && (
                                    <form onSubmit={handleForgot} className="flex flex-col gap-5">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-[#8B5CF6]" size={20} />
                                            <input type="email" value={forgotEmail} autoComplete="email" onChange={e => setForgotEmail(e.target.value)} placeholder="Email" className="bg-[#1a1a23] text-white pl-10 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#8B5CF6]" required aria-label="Email" />
                                        </div>
                                        <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit" className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white font-bold py-3 rounded-xl transition text-lg mt-2 shadow-lg">{loading ? "Gönderiliyor..." : "Kod Gönder"}</motion.button>
                                    </form>
                                )}
                                {resetStep === 1 && (
                                    <form onSubmit={handleReset} className="flex flex-col gap-5">
                                        <input type="text" value={resetCode} onChange={e => setResetCode(e.target.value)} placeholder="Mail kodunu giriniz" className="bg-[#1a1a23] text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-[#8B5CF6] text-center" required maxLength={6} />
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-[#8B5CF6]" size={20} />
                                            <input type="password" value={resetNewPass} autoComplete="new-password" onChange={e => setResetNewPass(e.target.value)} placeholder="Yeni Şifre (min 8 karakter)" className="bg-[#1a1a23] text-white pl-10 p-3 w-full rounded-xl focus:ring-2 focus:ring-[#8B5CF6]" required aria-label="Yeni Şifre" />
                                        </div>
                                        <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit" className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white font-bold py-3 rounded-xl transition text-lg shadow-lg">{loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}</motion.button>
                                    </form>
                                )}
                                {(msg || error) && (
                                    <div className="mt-3 text-center">
                                        {msg && <div className="text-green-400 font-semibold">{msg}</div>}
                                        {error && <div className="text-[#F47174] font-semibold">{error}</div>}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ÖZELLİKLER */}
            <section className="py-20 bg-[#18181b]">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-gradient-to-r from-[#8B5CF6] to-[#00fff0] bg-clip-text text-transparent">
                        NeuroDraft Neler Sunar?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* 1. AI ile Akıllı Özetleme */}
                        <div className="bg-[#232338] rounded-xl p-7 text-center flex flex-col items-center shadow-lg hover:scale-105 transition">
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mb-3">
                                <path d="M6 12a6 6 0 1112 0 6 6 0 01-12 0zm12 0v.01M12 18a6 6 0 100-12 6 6 0 000 12zm0 0v.01" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3 className="font-bold text-lg mb-2">AI ile Akıllı Özetleme</h3>
                            <p className="text-gray-400 text-sm">
                                Yüklediğin doküman, not, ses ve PDF’leri yapay zekâ ile birkaç saniyede özetle.
                                Karmaşık metinleri hızlıca anlamlı hale getir, önemli noktaları kaçırma.
                            </p>
                        </div>
                        {/* 2. Sınırsız Dosya & Not Arşivi */}
                        <div className="bg-[#232338] rounded-xl p-7 text-center flex flex-col items-center shadow-lg hover:scale-105 transition">
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mb-3">
                                <path d="M4 5a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm10 0v6h6" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3 className="font-bold text-lg mb-2">Sınırsız Dosya & Not Arşivi</h3>
                            <p className="text-gray-400 text-sm">
                                Klasörler oluştur, her klasöre metin notları, ses kayıtları, fotoğraflar ve PDF’ler ekle.
                                Tüm projelerini, derslerini veya iş akışını tek yerden yönet.
                            </p>
                        </div>
                        {/* 3. Kişisel AI Asistan ve Otomasyon */}
                        <div className="bg-[#232338] rounded-xl p-7 text-center flex flex-col items-center shadow-lg hover:scale-105 transition">
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mb-3">
                                <path d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-2 0v2m0-10V5a2 2 0 10-4 0v2a2 2 0 004 0V7m0 10a2 2 0 004 0v-2a2 2 0 00-4 0v2zm-4 0a2 2 0 01-4 0v-2a2 2 0 014 0v2z" stroke="#00fff0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3 className="font-bold text-lg mb-2">Kişisel AI Asistan & Otomasyon</h3>
                            <p className="text-gray-400 text-sm">
                                Her klasörün ve notun içinde akıllı sohbet botu ile konuş,
                                otomatik olarak sunum hazırla, sınav hatırlatıcıları ve kişisel asistan özelliği kullan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-[#232338] flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#8B5CF6] to-[#00fff0] bg-clip-text text-transparent">
                    Hemen Ücretsiz Kayıt Ol!
                </h2>
                <button onClick={() => { setTab("register"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition hover:scale-105">
                    Kayıt Ol
                </button>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm bg-[#18181b] border-t border-[#232338]">
                NeuroDraft © {new Date().getFullYear()} | “Your Brain, Your Notes”
            </footer>
        </div>
    );
}
