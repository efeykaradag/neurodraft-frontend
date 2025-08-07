"use client";
import {useRouter} from "next/navigation";


export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto py-10 px-5">
            <h1 className="text-2xl font-bold mb-4">Gizlilik Politikası / Privacy Policy</h1>

            <h2 className="mt-6 text-lg font-semibold">1. Giriş</h2>
            <p>
                {"NeuroDrafts"} olarak, kullanıcılarımızın kişisel verilerinin gizliliğine önem veriyoruz. Bu gizlilik politikası, sitemizi ve hizmetlerimizi kullandığınızda kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklar.
            </p>

            <h2 className="mt-6 text-lg font-semibold">2. Toplanan Veriler</h2>
            <ul className="list-disc ml-5">
                <li>Ad, soyad, e-posta adresi, telefon numarası</li>
                <li>Kayıt/üye olurken girdiğiniz bilgiler</li>
                <li>IP adresi ve cihaz bilgileri</li>
                <li>Çerezler (cookie), site içi hareketler</li>
            </ul>

            <h2 className="mt-6 text-lg font-semibold">3. Veri İşleme Amaçları</h2>
            <ul className="list-disc ml-5">
                <li>Hizmetlerimizi sunmak ve geliştirmek</li>
                <li>Kullanıcı desteği ve iletişim</li>
                <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
                <li>İstatistiksel analiz ve güvenlik</li>
                <li>Kullanıcıya kişiselleştirilmiş deneyim sunmak</li>
            </ul>

            <h2 className="mt-6 text-lg font-semibold">4. Verilerin Paylaşılması</h2>
            <ul className="list-disc ml-5">
                <li>Yasal yükümlülük gereği resmi kurumlarla paylaşılabilir.</li>
                <li>Üçüncü taraf hizmet sağlayıcıları (ör. hosting, e-posta servisleri) ile, sadece hizmet için gerekli ölçüde paylaşılır.</li>
                <li>Kişisel verileriniz, hiçbir şekilde izniniz olmadan satılmaz veya pazarlama amacıyla üçüncü şahıslara aktarılmaz.</li>
            </ul>

            <h2 className="mt-6 text-lg font-semibold">5. Haklarınız</h2>
            <ul className="list-disc ml-5">
                <li>Verilerinize erişme ve düzeltme hakkı</li>
                <li>Veri silme talebinde bulunma hakkı</li>
                <li>Veri işlenmesine itiraz etme hakkı</li>
                <li>Veri taşınabilirliği hakkı</li>
            </ul>
            <p>Haklarınızı kullanmak için <a href="/contact" className="underline">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>

            <h2 className="mt-6 text-lg font-semibold">6. Veri Güvenliği</h2>
            <p>
                Kişisel verileriniz, en güncel teknolojilerle korunur. Yetkisiz erişimi engellemek için hem yazılım hem de donanım düzeyinde tüm güvenlik önlemleri alınır.
            </p>

            <h2 className="mt-6 text-lg font-semibold">7. Çerezler (Cookies)</h2>
            <p>
                Sitemizde kullanıcı deneyimini artırmak için çerezler kullanılmaktadır. Detaylar için <a href="/cookies" className="underline">Çerez Politikası</a> sayfamızı inceleyebilirsiniz.
            </p>

            <h2 className="mt-6 text-lg font-semibold">8. Değişiklikler</h2>
            <p>
                Gizlilik politikamızda değişiklik yapıldığında bu sayfadan duyurulur. Güncel politikayı düzenli olarak kontrol edebilirsiniz.
            </p>

            <h2 className="mt-6 text-lg font-semibold">9. İletişim</h2>
            <p>
                Gizlilik ile ilgili her türlü soru için <a href="/contact" className="underline">iletişim</a> sayfamızdan bize ulaşabilirsiniz.
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
