import Image from "next/image";
import { User, LogOut } from "lucide-react";

interface HeaderProps {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    const themeGradient = "from-[#8B5CF6] via-[#06B6D4] to-[#00fff0]";
    return (
        <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-[#232338] shadow">
            <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-lg" />
                <span className={`text-xl md:text-2xl font-extrabold bg-gradient-to-r ${themeGradient} bg-clip-text text-transparent`}>NeuroDraft</span>
            </div>
            <div className="flex items-center gap-4">
                <User className="text-[#8B5CF6] w-7 h-7" />
                <button onClick={onLogout} className="flex items-center gap-1 px-3 py-2 bg-[#191b24] rounded-lg text-gray-300 hover:text-white text-sm">
                    <LogOut className="w-4 h-4 mr-1" /> Çıkış Yap
                </button>
            </div>
        </header>
    );
}
