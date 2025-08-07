"use client";

import {useRouter} from "next/navigation";

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto py-10 px-5">
            <h1 className="text-2xl font-bold mb-4">Kullanım Koşulları / Terms of Service</h1>

            <h2 className="mt-6 text-lg font-semibold">1. Tanımlar ve Kapsam</h2>
            <p>
                Bu Kullanım Koşulları (“Koşullar”), {"NeuroDraft"} platformunun tüm kullanıcıları için geçerlidir. Siteye erişen veya üye olan herkes, aşağıda belirtilen kuralları ve yükümlülükleri kabul etmiş sayılır.
            </p>

            <h2 className="mt-6 text-lg font-semibold">2. Hizmet Tanımı</h2>
            <p>
                Platformumuz; not alma, doküman yükleme, yapay zeka ile özetleme ve kişisel asistan hizmetleri sunar. Sunulan hizmetlerin kapsamı, site tarafından tek taraflı olarak değiştirilebilir veya geliştirilebilir.
            </p>

            <h2 className="mt-6 text-lg font-semibold">3. Üyelik ve Hesap Güvenliği</h2>
            <ul className="list-disc ml-5">
                <li>Kullanıcı, kayıt olurken doğru ve güncel bilgiler sunmak zorundadır.</li>
                <li>Hesap bilgilerinin gizliliği ve güvenliği tamamen kullanıcı sorumluluğundadır.</li>
                <li>Yetkisiz erişim veya şüpheli bir durum fark edilirse, kullanıcı derhal bize bildirmelidir.</li>
            </ul>

            <h2 className="mt-6 text-lg font-semibold">4. Kullanıcı Yükümlülükleri</h2>
            <ul className="list-disc ml-5">
                <li>Platformu hukuka ve ahlaka aykırı amaçlar için kullanamazsınız.</li>
                <li>Siteye yüklediğiniz tüm içeriklerden (metin, görsel, ses, pdf vb.) sorumlusunuz.</li>
                <li>Diğer kullanıcıların haklarını, gizliliğini ve güvenliğini ihlal edemezsiniz.</li>
                <li>Spam, reklam, zararlı yazılım veya yasa dışı içerik paylaşmak yasaktır.</li>
            </ul>

            <h2 className="mt-6 text-lg font-semibold">5. Fikri Mülkiyet Hakları</h2>
            <p>
                Sitede sunulan yazılım, tasarım, marka, logo ve içeriklerin tüm fikri hakları {process.env.NEXT_PUBLIC_APP_NAME ?? "Şirket"}’e aittir. İzinsiz kopyalama ve çoğaltma yasaktır.
            </p>

            <h2 className="mt-6 text-lg font-semibold">6. Hizmetin Sürekliliği ve Sorumluluk Reddi</h2>
            <ul className="list-disc ml-5">
                <li>Platformun kesintisiz veya hatasız çalışacağı garanti edilmez.</li>
                <li>Veri kaybı, teknik arıza veya üçüncü şahıs saldırılarında oluşabilecek zararlardan site yönetimi sorumlu tutulamaz.</li>
            </ul>

            <h2 className="mt-6 text-lg font-semibold">7. Sözleşme Değişiklikleri</h2>
            <p>
                Kullanım koşulları gerektiğinde güncellenebilir. Değişiklikler bu sayfada yayımlanır ve yayım anında yürürlüğe girer.
            </p>

            <h2 className="mt-6 text-lg font-semibold">8. Yürürlük ve Uyuşmazlıklar</h2>
            <p>
                Koşullar, siteyi kullanan herkes için geçerlidir. Uyuşmazlıklarda Polonya Cumhuriyeti yasaları geçerlidir.
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
