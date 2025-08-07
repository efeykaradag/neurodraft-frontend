export default function Footer() {
    return (
        <footer className="w-full py-6 bg-[#232338] text-gray-400 flex flex-col md:flex-row items-center justify-center gap-4 text-sm border-t border-[#18181b]">
            <a href="/privacy" className="hover:underline">Gizlilik Politikası</a>
            <span className="hidden md:inline">|</span>
            <a href="/terms" className="hover:underline">Kullanım Koşulları</a>
            <span className="hidden md:inline">|</span>
            <a href="/cookies" className="hover:underline">Çerez Politikası</a>
            <span className="hidden md:inline">|</span>
            <a href="/contact" className="hover:underline">İletişim</a>
            <span className="hidden md:inline">|</span>
            <span>© NeuroDrafts © {new Date().getFullYear()} | “Your Brain, Your Notes”</span>
        </footer>

    );
}
