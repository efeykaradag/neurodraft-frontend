"use client";
import { useRouter } from "next/navigation";

export default function CookiesPage() {
    const router = useRouter();
    return (
        <div className="max-w-2xl mx-auto py-10 px-5">
            <h1 className="text-2xl font-bold mb-4">Çerez Politikası (Cookie Policy)</h1>
            <p>
                Sitemiz NeuroDrafts olarak, kullanıcı deneyimini artırmak, site kullanımını analiz etmek ve hizmetlerimizi geliştirmek amacıyla çerezlerden yararlanıyoruz.
            </p>
            <h2 className="mt-6 text-lg font-semibold">Çerez Nedir?</h2>
            <p>
                Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Sitemizi tekrar ziyaret ettiğinizde sizi tanımamıza yardımcı olur.
            </p>
            <h2 className="mt-6 text-lg font-semibold">Kullanılan Çerezler</h2>
            <ul className="list-disc ml-5">
                <li><b>Zorunlu Çerezler:</b> Sitenin temel işlevlerini sağlayan çerezler.</li>
                <li><b>Analitik Çerezler:</b> Ziyaretçi hareketlerini analiz ederek site performansını iyileştirir.</li>
                <li><b>Pazarlama Çerezleri:</b> Kişiselleştirilmiş reklam ve kampanya sunulmasına yardımcı olur (isteğe bağlı).</li>
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Çerez Ayarları</h2>
            <p>
                Tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya silebilirsiniz. Ancak bu durumda bazı hizmetlerimiz düzgün çalışmayabilir.
            </p>
            <h2 className="mt-6 text-lg font-semibold">Daha Fazla Bilgi</h2>
            <p>
                Detaylı bilgi için <a href="/privacy" className="underline">Gizlilik Politikası</a> sayfamızı ziyaret edebilirsiniz.
            </p>
            <button
                onClick={() => router.push("/")}
                className="mt-6 mb-4 px-6 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] text-white font-bold shadow-md hover:scale-105 transition"
            >
                Ana Sayfaya Dön
            </button>
        </div>
    );
}
