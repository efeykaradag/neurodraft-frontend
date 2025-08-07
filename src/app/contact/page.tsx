"use client"; // Eğer formda useState, useEffect veya başka client-side logic olacaksa!

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [success, setSuccess] = useState(false);
    const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setSuccess(true);
            setForm({ name: "", email: "", message: "" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-5">
            <h1 className="text-2xl font-bold mb-4">İletişim / Contact & Legal Notice</h1>

            <div className="bg-gray-900 p-5 rounded-xl mb-6">
                <h2 className="font-semibold mb-2">Şirket Bilgileri</h2>
                <ul className="mb-3 text-sm">
                    <li><b>Şirket Adı:</b> EMEF TRADE SP. Z O.O.</li>
                    <li><b>Adres:</b> UL. AUGUSTYNA SZAMARZEWSKIEGO 21 /2, 60-514 POZNAŃ POLAND</li>
                    <li><b>Vergi Numarası (NIP):</b> 7792581156</li>
                    <li><b>Telefon:</b> +48 572 434 727</li>
                    <li><b>E-posta:</b> info@neurodrafts.com</li>
                    <li><b>Yetkili Kişi:</b> Efe Yiğit Karadağ</li>
                </ul>
                <h2 className="font-semibold mb-1">Legal Notice / Impressum</h2>
                <p className="text-xs">
                    Bu site, EMEF TRADE SP. Z O.O. tarafından işletilmektedir. Yasal gereksinimler doğrultusunda iletişim bilgilerimiz yukarıda sunulmuştur.
                </p>
            </div>

            <h2 className="font-semibold mb-4">Bize Mesaj Gönderin / Send a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Adınız / Name"
                    required
                    className="p-2 rounded border"
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="E-posta / Email"
                    required
                    className="p-2 rounded border"
                />
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Mesajınız / Your message"
                    required
                    className="p-2 rounded border"
                    rows={5}
                />
                <button type="submit" className="bg-blue-700 text-white rounded p-2 font-semibold hover:bg-blue-800 transition">Gönder / Send</button>
            </form>

            {success && (
                <div className="mt-4 text-green-700 font-bold">
                    Mesajınız başarıyla gönderildi! / Your message has been sent!
                </div>
            )}
            <button
                onClick={() => router.push("/")}
                className="mt-6 mb-4 px-6 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white font-bold shadow-md hover:scale-105 transition"
            >
                Ana Sayfaya Dön
            </button>
        </div>
    );
}
