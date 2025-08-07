"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) setShow(true);
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setShow(false);
    };

    const handleReject = () => {
        localStorage.setItem("cookieConsent", "rejected");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between shadow-xl">
      <span>
        Sitemiz, size en iyi deneyimi sunmak ve ziyaretçi trafiğini analiz etmek için çerezleri kullanır.
        <a href="/cookies" className="underline ml-1" target="_blank">Çerez Politikası</a>
      </span>
            <div className="mt-3 md:mt-0 flex gap-2">
                <button onClick={handleAccept} className="bg-green-600 px-4 py-1 rounded hover:bg-green-700">Kabul Et</button>
                <button onClick={handleReject} className="bg-red-600 px-4 py-1 rounded hover:bg-red-700">Reddet</button>
            </div>
        </div>
    );
}
