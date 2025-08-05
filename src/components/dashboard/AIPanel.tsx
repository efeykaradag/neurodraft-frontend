"use client";

import React, { useState } from "react";
import { Sparkles, Bot, FileText, Edit3, Loader2, Tag } from "lucide-react";
import { motion } from "framer-motion";
import {Note, UploadedFile} from "@/types/types";

// AIBox component
interface AIBoxProps {
    title: string;
    desc: string;
    color: string;
    icon: React.ReactNode;
    cta: string;
    badge?: string;
    loading?: boolean;
    result?: string | null;
    onClick?: () => void;
}
function AIBox({ title, desc, color, icon, cta, badge, loading, onClick, result }: AIBoxProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.025, y: -2, boxShadow: "0 8px 32px 0 #00fff099" }}
            className={`relative group bg-[#232338] p-4 rounded-2xl shadow flex items-center gap-3 transition border-l-4 ${color ? "border-gradient-l " + color : "border-[#8B5CF6]"}`}
            style={{ borderImage: color ? `linear-gradient(to bottom, var(--tw-gradient-stops)) 1` : undefined }}
        >
            <div className="shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="font-bold mb-0.5 flex items-center gap-2">
                    {title}
                    {badge && (
                        <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${badge === "beta" ? "bg-yellow-400/30 text-yellow-400" : "bg-[#232338] border border-[#00fff0] text-[#00fff0]"}`}>
                            {badge === "beta" ? "BETA" : badge.toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="text-xs text-gray-400">{desc}</div>
                {result && (
                    <div className="text-[13px] text-gray-200 font-mono mt-2 bg-black/10 rounded-lg p-2 max-h-40 overflow-y-auto whitespace-pre-wrap border border-[#2d2d40]">
                        {result}
                    </div>
                )}
            </div>
            <button
                className={`ml-2 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r ${color} text-white shadow hover:scale-105 transition flex items-center gap-2`}
                tabIndex={-1}
                type="button"
                onClick={onClick}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : cta}
            </button>
        </motion.div>
    );
}

interface AIPanelProps {
    activeNote: Note | null;
    setActiveNote: (note: Note | null) => void;
    activeFolderId: number | null;
    activeFile: UploadedFile | null;
    setActiveFile: (file: UploadedFile | null) => void;
}

export default function AIPanel({ activeNote, setActiveNote, activeFolderId, activeFile, setActiveFile }: AIPanelProps) {
    // AI State’leri
    const [folderSummary, setFolderSummary] = useState<string | null>(null);
    const [folderSummaryLoading, setFolderSummaryLoading] = useState(false);
    const [folderChatResult, setFolderChatResult] = useState<string | null>(null);
    const [folderChatLoading, setFolderChatLoading] = useState(false);
    const [folderTags, setFolderTags] = useState<string | null>(null);
    const [folderTagsLoading, setFolderTagsLoading] = useState(false);
    const [folderPresentation, setFolderPresentation] = useState<string | null>(null);
    const [folderPresentationLoading, setFolderPresentationLoading] = useState(false);

    // Not AI state’leri
    const [noteSummary, setNoteSummary] = useState<string | null>(null);
    const [noteSummaryLoading, setNoteSummaryLoading] = useState(false);
    const [noteTitle, setNoteTitle] = useState<string | null>(null);
    const [noteTitleLoading, setNoteTitleLoading] = useState(false);
    const [noteMarkdown, setNoteMarkdown] = useState<string | null>(null);
    const [noteMarkdownLoading, setNoteMarkdownLoading] = useState(false);
    const [noteChat, setNoteChat] = useState<string | null>(null);
    const [noteChatLoading, setNoteChatLoading] = useState(false);
    const [noteRefs, setNoteRefs] = useState<string | null>(null);
    const [noteRefsLoading, setNoteRefsLoading] = useState(false);

    // --- Klasör AI fonksiyonları ---
    const handleFolderSummary = async () => {
        if (!activeFolderId) return alert("Klasör seçilmedi!");
        setFolderSummaryLoading(true);
        setFolderSummary(null);
        console.log("AI post body", { folder_id: activeFolderId, type: typeof activeFolderId });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/folder_summary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(activeFolderId),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);

            const data = await res.json();
            setFolderSummary(data.summary || "AI özet üretemedi.");
        } catch (err) {
            setFolderSummary("Bir hata oluştu: " + err);
            console.error(err);
        }
        setFolderSummaryLoading(false);
    };

    const handleFolderChat = async () => {
        if (!activeFolderId) return alert("Klasör seçilmedi!");
        setFolderChatLoading(true);
        setFolderChatResult(null);
        const question = prompt("Klasördeki notlarla ilgili AI’a sor:");
        if (!question) { setFolderChatLoading(false); return; }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/folder_chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({folder_id:activeFolderId,question}),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setFolderChatResult(data.answer || "AI cevap veremedi.");
        } catch (err) {
            setFolderChatResult("Bir hata oluştu: " + err);
        }
        setFolderChatLoading(false);
    };

    const handleFolderTags = async () => {
        if (!activeFolderId) return alert("Klasör seçilmedi!");
        setFolderTagsLoading(true);
        setFolderTags(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/folder_tags`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(activeFolderId),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setFolderTags(data.tags || "AI etiket bulamadı.");
        } catch (err) {
            setFolderTags("Bir hata oluştu: " + err);
        }
        setFolderTagsLoading(false);
    };

    const handleFolderPresentation = async () => {
        if (!activeFolderId) return alert("Klasör seçilmedi!");
        setFolderPresentationLoading(true);
        setFolderPresentation(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/folder_presentation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(activeFolderId),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setFolderPresentation(data.presentation || "AI sunum oluşturamadı.");
        } catch (err) {
            setFolderPresentation("Bir hata oluştu: " + err);
        }
        setFolderPresentationLoading(false);
    };

    // --- Not AI fonksiyonları ---
    const handleNoteSummary = async () => {
        if (!activeNote) return;
        setNoteSummaryLoading(true);
        setNoteSummary(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/note_summary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ note_id: activeNote.id, text: activeNote.content }),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setNoteSummary(data.summary || "AI özet üretemedi.");
        } catch (err) { setNoteSummary("Bir hata oluştu: " + err); }
        setNoteSummaryLoading(false);
    };

    const handleNoteTitleSuggest = async () => {
        if (!activeNote) return;
        setNoteTitleLoading(true);
        setNoteTitle(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/note_title`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ note_id: activeNote.id, text: activeNote.content }),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setNoteTitle(data.title || "AI başlık öneremedi.");
        } catch (err) { setNoteTitle("Bir hata oluştu: " + err); }
        setNoteTitleLoading(false);
    };

    const handleNoteMarkdownFix = async () => {
        if (!activeNote) return;
        setNoteMarkdownLoading(true);
        setNoteMarkdown(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/note_markdown`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ note_id: activeNote.id, text: activeNote.content }),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setNoteMarkdown(data.markdown || "AI markdown düzeltemedi.");
        } catch (err) { setNoteMarkdown("Bir hata oluştu: " + err); }
        setNoteMarkdownLoading(false);
    };

    const handleNoteChat = async () => {
        if (!activeNote) return;
        setNoteChatLoading(true);
        setNoteChat(null);
        const question = prompt("Seçili nota AI’a sormak istediğin soruyu yaz:");
        if (!question) { setNoteChatLoading(false); return; }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/note_chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ note_id: activeNote.id, question }),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setNoteChat(data.answer || "AI cevap veremedi.");
        } catch (err) { setNoteChat("Bir hata oluştu: " + err); }
        setNoteChatLoading(false);
    };

    const handleNoteReferences = async () => {
        if (!activeNote) return;
        setNoteRefsLoading(true);
        setNoteRefs(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/note_references`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ note_id: activeNote.id, text: activeNote.content }),
            });
            if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
            const data = await res.json();
            setNoteRefs(data.references || "AI referans bulamadı.");
        } catch (err) { setNoteRefs("Bir hata oluştu: " + err); }
        setNoteRefsLoading(false);
    };

    const handleNoteAudioSummary = async () => {
        if (!activeNote) return;
        setNoteSummaryLoading(true);

        let summary = "";
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/note_summary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ note_id: activeNote.id, text: activeNote.content }),
            });
            if (!res.ok) throw new Error("Özet alınamadı: " + res.status);
            const data = await res.json();
            summary = data.summary || "";
        } catch (err) {
            alert("Özet alınırken hata: " + err);
            setNoteSummaryLoading(false);
            return;
        }

        try {
            const audioRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/note_audio_summary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: summary })
            });
            if (!audioRes.ok) throw new Error("TTS hatası: " + audioRes.status);
            const blob = await audioRes.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
        } catch (err) {
            alert("Sesli özetleme başarısız: " + err);
        }
        setNoteSummaryLoading(false);
    };



    // ----------- RENDER -----------
    return (
        <aside className="w-full md:w-[380px] min-w-[260px] max-w-[440px] border-l border-[#232338] bg-[#1a1a23] flex flex-col h-full sticky top-0 z-20 p-0">
            <div className="sticky top-0 z-10 bg-[#1a1a23] border-b border-[#232338] flex items-center gap-2 px-6 pt-6 pb-2">
                <Sparkles size={28} className="text-[#8B5CF6] animate-spin-slow" />
                <span className="font-extrabold text-lg bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent tracking-wide">AI Özellikleri</span>
                {activeNote &&(
                    <button onClick={() => setActiveNote(null)}
                            className="ml-auto px-3 py-1 rounded-lg bg-[#232338] border border-[#8B5CF6] text-[#8B5CF6] text-xs font-bold shadow hover:bg-[#8B5CF6] hover:text-white transition">
                        Seçimi Kaldır
                    </button>
                )}
                {activeFile &&(
                <button onClick={() => setActiveFile(null)}
                        className="ml-auto px-3 py-1 rounded-lg bg-[#232338] border border-[#8B5CF6] text-[#8B5CF6] text-xs font-bold shadow hover:bg-[#8B5CF6] hover:text-white transition">
                    Seçimi Kaldır
                </button>
                )}
            </div>
            <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto">
                {!activeNote && !activeFile && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col items-center text-center mb-6">
                            <Sparkles size={40} className="text-[#00fff0] animate-pulse" />
                            <div className="font-extrabold text-2xl bg-gradient-to-r from-[#8B5CF6] to-[#00fff0] bg-clip-text text-transparent mt-2 mb-1">Klasör AI Asistanı</div>
                            <div className="text-gray-400 mb-2 text-sm">Klasördeki tüm notları analiz eder ve özet, etiketleme, sunum gibi işlemler yapar.</div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <AIBox
                                title="Tüm Notları Özetle"
                                desc="Klasördeki tüm notlardan kısa özet çıkar."
                                color="from-[#8B5CF6] to-[#06B6D4]"
                                icon={<Sparkles size={22} />}
                                cta="Özetle"
                                loading={folderSummaryLoading}
                                onClick={handleFolderSummary}
                                result={folderSummary}
                            />
                            <AIBox
                                title="Klasör Sohbet"
                                desc="Klasördeki notlarla AI chatbot asistanı."
                                color="from-[#00fff0] to-[#8B5CF6]"
                                icon={<Bot size={21} />}
                                cta="Sohbet Et"
                                loading={folderChatLoading}
                                onClick={handleFolderChat}
                                result={folderChatResult}
                            />
                            <AIBox
                                title="Klasör Etiketleme"
                                desc="Notları otomatik olarak konuya göre etiketle."
                                color="from-[#06B6D4] to-[#00fff0]"
                                icon={<Tag size={20} />}
                                cta="Etiketle"
                                loading={folderTagsLoading}
                                onClick={handleFolderTags}
                                result={folderTags}
                            />
                            <AIBox
                                title="Sunum Hazırla"
                                desc="Klasördeki notlardan otomatik sunum oluştur."
                                color="from-[#8B5CF6] to-[#F47174]"
                                icon={<FileText size={21} />}
                                cta="Hazırla"
                                badge="beta"
                                loading={folderPresentationLoading}
                                onClick={handleFolderPresentation}
                                result={folderPresentation}
                            />
                        </div>
                    </motion.div>
                )}
                {activeNote && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="mb-2">
                            <div className="font-bold text-[#06B6D4] text-lg">{activeNote.title}</div>
                            <div className="text-gray-400 text-xs mb-1">AI özel not modunda</div>
                        </div>
                        <AIBox
                            title="Notu Özetle"
                            desc="Seçili notu AI ile özetle, ana noktaları çıkar."
                            color="from-[#8B5CF6] to-[#06B6D4]"
                            icon={<Sparkles size={22} />}
                            cta="Özetle"
                            loading={noteSummaryLoading}
                            onClick={handleNoteSummary}
                            result={noteSummary}
                        />
                        <AIBox
                            title="Başlık/Alt Başlık Öner"
                            desc="Daha iyi başlık/alt başlık önerileri al."
                            color="from-[#06B6D4] to-[#00fff0]"
                            icon={<Edit3 size={20} />}
                            cta="Öner"
                            loading={noteTitleLoading}
                            onClick={handleNoteTitleSuggest}
                            result={noteTitle}
                        />
                        <AIBox
                            title="Markdown Onarımı"
                            desc="Markdown biçimini AI ile düzelt."
                            color="from-[#00fff0] to-[#8B5CF6]"
                            icon={<FileText size={20} />}
                            cta="Düzelt"
                            loading={noteMarkdownLoading}
                            onClick={handleNoteMarkdownFix}
                            result={noteMarkdown}
                        />
                        <AIBox
                            title="Not Chat"
                            desc="Bu nota özel AI chatbot."
                            color="from-[#8B5CF6] to-[#F47174]"
                            icon={<Bot size={20} />}
                            cta="Sohbet Et"
                            loading={noteChatLoading}
                            onClick={handleNoteChat}
                            result={noteChat}
                        />
                        <AIBox
                            title="Referans Analizi"
                            desc="Kaynakları ve referansları AI ile bul."
                            color="from-[#F47174] to-[#8B5CF6]"
                            icon={<FileText size={18} />}
                            cta="Analiz Et"
                            loading={noteRefsLoading}
                            onClick={handleNoteReferences}
                            result={noteRefs}
                        />
                        <AIBox
                            title="Sesli Özetle"
                            desc="AI notunu okuyup sesli özet üretir."
                            color="from-[#00fff0] to-[#06B6D4]"
                            icon={<Bot size={19} />}
                            cta="Dinle"
                            loading={noteRefsLoading}
                            onClick={handleNoteAudioSummary}
                        />
                    </motion.div>
                )}
                {activeFile && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="mb-2">
                            <div className="font-bold text-[#06B6D4] text-lg">{activeFile.title}</div>
                            <div className="text-gray-400 text-xs mb-1">AI özel not modunda</div>
                        </div>
                        <AIBox
                            title="Notu Özetle"
                            desc="Seçili Dosyayı AI ile özetle, ana noktaları çıkar."
                            color="from-[#8B5CF6] to-[#06B6D4]"
                            icon={<Sparkles size={22} />}
                            cta="Özetle"
                            loading={noteSummaryLoading}
                            onClick={handleNoteSummary}
                            result={noteSummary}
                        />
                        <AIBox
                            title="Başlık/Alt Başlık Öner"
                            desc="Daha iyi başlık/alt başlık önerileri al."
                            color="from-[#06B6D4] to-[#00fff0]"
                            icon={<Edit3 size={20} />}
                            cta="Öner"
                            loading={noteTitleLoading}
                            onClick={handleNoteTitleSuggest}
                            result={noteTitle}
                        />
                        <AIBox
                            title="Markdown Onarımı"
                            desc="Markdown biçimini AI ile düzelt."
                            color="from-[#00fff0] to-[#8B5CF6]"
                            icon={<FileText size={20} />}
                            cta="Düzelt"
                            loading={noteMarkdownLoading}
                            onClick={handleNoteMarkdownFix}
                            result={noteMarkdown}
                        />
                        <AIBox
                            title="Not Chat"
                            desc="Bu nota özel AI chatbot."
                            color="from-[#8B5CF6] to-[#F47174]"
                            icon={<Bot size={20} />}
                            cta="Sohbet Et"
                            loading={noteChatLoading}
                            onClick={handleNoteChat}
                            result={noteChat}
                        />
                        <AIBox
                            title="Referans Analizi"
                            desc="Kaynakları ve referansları AI ile bul."
                            color="from-[#F47174] to-[#8B5CF6]"
                            icon={<FileText size={18} />}
                            cta="Analiz Et"
                            loading={noteRefsLoading}
                            onClick={handleNoteReferences}
                            result={noteRefs}
                        />
                        <AIBox
                            title="Sesli Özetle"
                            desc="AI notunu okuyup sesli özet üretir."
                            color="from-[#00fff0] to-[#06B6D4]"
                            icon={<Bot size={19} />}
                            cta="Dinle"
                            badge="yakında"
                            loading={false}
                            onClick={handleNoteAudioSummary}
                        />
                    </motion.div>
                )}
            </div>
        </aside>
    );
}
