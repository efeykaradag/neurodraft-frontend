'use client';

import { useState, useEffect } from "react";
import { FolderPlus, FileText, LogOut, User, Pencil, Trash2, Check, X, Edit3, Bot, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

export interface AIBoxProps {
    title: string;
    desc: string;
    color: string;
    icon: React.ReactNode;
    cta: string;
    badge?: string;
}

export interface Folder {
    id: number;
    name: string;
    user_id: number;
    notes?: Note[];
    files?: FileModel[];
}

export interface Note {
    id: number;
    title: string;
    content: string;
    created_at: string;
    folder_id: number;
}

export interface FileModel {
    id: number;
    folder_id: number;
    user_id: number;
    filename: string;
    filepath: string;
    filetype: string;
    uploaded_at: string;
    extracted_text: string
}

// --- API HELPER ---
async function apiFetch(url: string, options: RequestInit = {} = {}) {
    return fetch(url, {
        ...options,
        credentials: "include", // Cookie otomatik gitsin!
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
        },
    });
}

// --- AI BOX COMPONENT ---
function AIBox({ title, desc, color, icon, cta, badge }: AIBoxProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.025, y: -2, boxShadow: "0 8px 32px 0 #00fff099" }}
            className={`relative group bg-[#232338] p-4 rounded-2xl shadow flex items-center gap-3 transition border-l-4 ${color ? "border-gradient-l "+color : "border-[#8B5CF6]"}`}
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
            </div>
            <button
                className={`ml-2 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r ${color} text-white shadow hover:scale-105 transition`}
                tabIndex={-1}
                type="button"
            >{cta}</button>
        </motion.div>
    );
}

// --- DASHBOARD PAGE ---
export default function DashboardPage() {
    // State'ler
    const [folders, setFolders] = useState<Folder[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);

    // Folder State
    const [showAddFolder, setShowAddFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [editFolderName, setEditFolderName] = useState("");
    const [showDeleteFolderId, setShowDeleteFolderId] = useState<number | null>(null);

    // Note State
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNote, setNewNote] = useState("");
    const [editNoteId, setEditNoteId] = useState<number | null>(null);
    const [editNoteTitle, setEditNoteTitle] = useState("");
    const [editNoteContent, setEditNoteContent] = useState("");
    const [showDeleteNoteId, setShowDeleteNoteId] = useState<number | null>(null);

    // Kullanıcı ve loading state
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Dummy AI State (entegre için hazır)
    const [aiChat, setAiChat] = useState<string[]>([]);
    const [chatInput, setChatInput] = useState("");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            credentials: "include",
        }).then(res => {
            if (!res.ok) {
                router.replace("/login");
            }
        });
    }, [router]);

    // Klasörleri yükle
    useEffect(() => {
        const fetchFolders = async () => {
            setLoading(true);
            const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders`);
            if (res.ok) {
                const data = await res.json();
                setFolders(data);
                if (data.length && !activeFolderId) setActiveFolderId(data[0].id);
            }
            setLoading(false);
        };
        fetchFolders();
    }, []);

    // Aktif klasör değişince notları yükle
    useEffect(() => {
        if (activeFolderId == null) return;
        setActiveNote(null); // klasör değişince not seçimini kaldır
        const fetchNotes = async () => {
            setLoading(true);
            const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${activeFolderId}/notes`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
            setLoading(false);
        };
        fetchNotes();
    }, [activeFolderId]);

    // Folder işlemleri
    const handleAddFolder = async () => {
        if (!newFolderName.trim()) return;
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders`, {
            method: "POST",
            body: JSON.stringify({ name: newFolderName }),
        });
        if (res.ok) {
            const newFolder = await res.json();
            setFolders((prev) => [...prev, newFolder]);
            setActiveFolderId(newFolder.id);
            setNewFolderName("");
            setShowAddFolder(false);
        }
        setLoading(false);
    };

    const handleDeleteFolder = async (folderId: number) => {
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setFolders((prev) => prev.filter((f) => f.id !== folderId));
            if (activeFolderId === folderId && folders.length > 1) setActiveFolderId(folders.find((f) => f.id !== folderId)?.id || null);
            else if (folders.length === 1) setActiveFolderId(null);
            setShowDeleteFolderId(null);
        }
        setLoading(false);
    };

    const handleEditFolder = async (folderId: number) => {
        if (!editFolderName.trim()) return;
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}`, {
            method: "PATCH",
            body: JSON.stringify({ name: editFolderName }),
        });
        if (res.ok) {
            setFolders((prev) => prev.map(f => f.id === folderId ? { ...f, name: editFolderName } : f));
            setEditFolderId(null);
        }
        setLoading(false);
    };

    // Note işlemleri
    const handleAddNote = async () => {
        if (!newNoteTitle.trim() || !newNote.trim() || !activeFolderId) return;
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${activeFolderId}/notes`, {
            method: "POST",
            body: JSON.stringify({ title: newNoteTitle, content: newNote }),
        });
        if (res.ok) {
            const note = await res.json();
            setNotes((prev) => [...prev, note]);
            setNewNote("");
            setNewNoteTitle("");
        }
        setLoading(false);
    };

    const handleDeleteNote = async (noteId: number) => {
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setNotes((prev) => prev.filter((n) => n.id !== noteId));
            setShowDeleteNoteId(null);
            if (activeNote?.id === noteId) setActiveNote(null);
        }
        setLoading(false);
    };

    const handleEditNote = async (noteId: number) => {
        if (!editNoteTitle.trim() || !editNoteContent.trim()) return;
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
            method: "PATCH",
            body: JSON.stringify({ title: editNoteTitle, content: editNoteContent }),
        });
        if (res.ok) {
            setNotes((prev) =>
                prev.map(n =>
                    n.id === noteId ? { ...n, title: editNoteTitle, content: editNoteContent } : n
                )
            );
            setEditNoteId(null);
            setActiveNote((prev: Note | null) =>
                prev && prev.id === noteId
                    ? { ...prev, title: editNoteTitle, content: editNoteContent }
                    : prev
            );
        }
        setLoading(false);
    };



    // Çıkış işlemi
    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
        window.location.href = "/";
    };

    // AI Chat Dummy (gerçekleştirilecek)
    const sendChat = () => {
        if (!chatInput.trim()) return;
        setAiChat((prev) => [...prev, chatInput, "AI: ... (dummy cevap)"]);
        setChatInput("");
    };

    // Tema gradient
    const themeGradient = "from-[#8B5CF6] via-[#06B6D4] to-[#00fff0]";

    // --- RETURN (UI) ---
    return (
        <div className="min-h-screen bg-[#18181b] flex flex-col">
            {/* HEADER */}
            <header className="flex items-center justify-between px-7 py-5 bg-[#232338] shadow">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Logo" width={42} height={42} className="rounded-lg" />
                    <span className={`text-2xl font-extrabold bg-gradient-to-r ${themeGradient} bg-clip-text text-transparent`}>NeuroDrafts</span>
                </div>
                <div className="flex items-center gap-4">
                    <User className="text-[#8B5CF6] w-7 h-7" />
                    <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 bg-[#191b24] rounded-lg text-gray-300 hover:text-white text-sm">
                        <LogOut className="w-4 h-4 mr-1" /> Çıkış Yap
                    </button>
                </div>
            </header>

            {/* MAIN */}
            <div className="flex flex-1 overflow-hidden">
                {/* SOL SİDEBAR */}
                <aside className="w-72 bg-[#232338] border-r border-[#191b24] flex flex-col py-8 px-4">
                    <div className="flex justify-between items-center mb-5">
                        <span className="text-lg font-bold text-gray-300">Klasörler</span>
                        <button
                            className={`bg-gradient-to-r ${themeGradient} p-1.5 rounded-xl text-white`}
                            title="Klasör Ekle"
                            onClick={() => setShowAddFolder(v => !v)}>
                            <FolderPlus size={20} />
                        </button>
                    </div>
                    <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
                        {folders.length === 0 && <span className="text-gray-500">Klasör yok.</span>}
                        {folders.map((folder) => (
                            <motion.div key={folder.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className={`group flex items-center justify-between px-4 py-2 rounded-lg transition font-medium ${folder.id === activeFolderId ? "bg-gradient-to-r from-[#8B5CF6]/80 to-[#06B6D4]/80 text-white shadow" : "text-gray-300 hover:bg-[#191b24]"}`}>
                                    {editFolderId === folder.id ? (
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                className="bg-[#191b24] text-white p-1 px-2 rounded"
                                                value={editFolderName}
                                                onChange={e => setEditFolderName(e.target.value)}
                                                autoFocus
                                                onKeyDown={e => e.key === "Enter" && handleEditFolder(folder.id)}
                                            />
                                            <button onClick={() => handleEditFolder(folder.id)} className="text-green-400"><Check size={18} /></button>
                                            <button onClick={() => setEditFolderId(null)} className="text-gray-400"><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <button className="flex-1 text-left truncate" onClick={() => setActiveFolderId(folder.id)}>
                                            {folder.name}
                                        </button>
                                    )}
                                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition">
                                        <button title="Düzenle" onClick={() => { setEditFolderId(folder.id); setEditFolderName(folder.name); }}>
                                            <Pencil size={16} className="text-cyan-400" />
                                        </button>
                                        <button title="Sil" onClick={() => setShowDeleteFolderId(folder.id)}>
                                            <Trash2 size={16} className="text-[#F47174]" />
                                        </button>
                                    </div>
                                </div>
                                {/* Silme modalı */}
                                <AnimatePresence>
                                    {showDeleteFolderId === folder.id && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                            <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 20 }} transition={{ type: "spring" }}
                                                        className="bg-[#232338] rounded-xl shadow-2xl p-8 w-full max-w-xs text-center border border-[#8B5CF6]">
                                                <div className="text-xl font-bold text-[#F47174] mb-3">Klasörü silmek istediğine emin misin?</div>
                                                <div className="flex justify-center gap-4 mt-4">
                                                    <button className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold shadow"
                                                            onClick={() => handleDeleteFolder(folder.id)}>
                                                        Sil
                                                    </button>
                                                    <button className="bg-[#191b24] text-gray-300 px-4 py-2 rounded-lg font-bold shadow"
                                                            onClick={() => setShowDeleteFolderId(null)}>
                                                        Vazgeç
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </nav>
                    {showAddFolder && (
                        <div className="mt-5 flex flex-col gap-2">
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                placeholder="Yeni klasör adı"
                                className="bg-[#1a1a23] text-white p-2 rounded-lg"
                                autoFocus
                            />
                            <button
                                onClick={handleAddFolder}
                                className={`bg-gradient-to-r ${themeGradient} text-white font-bold py-2 rounded-lg shadow transition`}
                            >
                                Ekle
                            </button>
                        </div>
                    )}
                </aside>

                {/* ANA İÇERİK */}
                <main className="flex-1 flex flex-col md:flex-row gap-7 p-8 bg-[#18181b] overflow-y-auto">
                    {/* NOTLAR - Kare Card Grid */}
                    <section className="flex-1 bg-[#232338] rounded-2xl shadow-xl p-7 min-h-[320px] flex flex-col">
                        <div className="flex items-center gap-2 mb-5">
                            <FileText size={28} className="text-[#8B5CF6]" />
                            <h2 className="text-xl font-bold">
                                Notlar {folders.find(f => f.id === activeFolderId)?.name && `(${folders.find(f => f.id === activeFolderId)?.name})`}
                            </h2>
                        </div>
                        {/* --- KARE GRID --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-3 flex-1">
                            {notes.length > 0 ? (
                                notes.map((note) => (
                                    <motion.div
                                        key={note.id}
                                        className={`
                                  group relative rounded-2xl bg-[#1a1a23] shadow-xl cursor-pointer border-2 transition-all duration-200 flex flex-col
                                  min-h-[180px] aspect-square p-5
                                  ${activeNote?.id === note.id
                                            ? "border-[#00fff0] shadow-[0_4px_24px_#00fff055]"
                                            : "border-transparent hover:border-[#8B5CF6]/60 hover:shadow-lg"}
                                `}
                                        whileHover={{ scale: 1.04, y: -2, boxShadow: "0 8px 32px 0 #8B5CF699" }}
                                        onClick={() => setActiveNote(note)}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText size={20} className="text-[#06B6D4]" />
                                            <span className="font-bold text-base truncate">{note.title}</span>
                                        </div>
                                        <div className="text-gray-400 text-xs mb-2">{new Date(note.created_at).toLocaleString()}</div>
                                        <div className="text-sm text-gray-100 flex-1 overflow-hidden line-clamp-5">
                                            <ReactMarkdown>{note.content}</ReactMarkdown>
                                        </div>
                                        <div className="absolute bottom-3 left-4 flex gap-3">
                                            <button
                                                onClick={e => { e.stopPropagation(); setEditNoteId(note.id); setEditNoteTitle(note.title); setEditNoteContent(note.content); }}
                                                title="Düzenle"
                                                className="text-cyan-400 hover:scale-110"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={e => { e.stopPropagation(); setShowDeleteNoteId(note.id); }}
                                                title="Sil"
                                                className="text-[#F47174] hover:scale-110"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); setActiveNote(note); }}
                                            title="AI Asistan"
                                            className="absolute bottom-3 right-4 text-[#00fff0] opacity-70 group-hover:opacity-100 hover:scale-125 transition"
                                        >
                                            <Bot size={19} />
                                        </button>
                                        {/* Not sil ve edit modalı */}
                                        <AnimatePresence>
                                            {showDeleteNoteId === note.id && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                                    <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 20 }} transition={{ type: "spring" }}
                                                                className="bg-[#232338] rounded-xl shadow-2xl p-8 w-full max-w-xs text-center border border-[#8B5CF6]">
                                                        <div className="text-xl font-bold text-[#F47174] mb-3">Notu silmek istediğine emin misin?</div>
                                                        <div className="flex justify-center gap-4 mt-4">
                                                            <button className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold shadow"
                                                                    onClick={() => handleDeleteNote(note.id)}>
                                                                Sil
                                                            </button>
                                                            <button className="bg-[#191b24] text-gray-300 px-4 py-2 rounded-lg font-bold shadow"
                                                                    onClick={() => setShowDeleteNoteId(null)}>
                                                                Vazgeç
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <AnimatePresence>
                                            {editNoteId === note.id && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                                                    <motion.div initial={{ scale: 0.97, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} transition={{ type: "spring" }}
                                                                className="bg-[#232338] rounded-xl shadow-2xl p-8 w-full max-w-md text-left border border-[#8B5CF6]">
                                                        <h3 className="text-xl font-bold text-cyan-400 mb-4">Notu Düzenle</h3>
                                                        <input className="bg-[#1a1a23] text-white p-2 rounded-lg mb-2 w-full font-bold"
                                                               value={editNoteTitle}
                                                               onChange={e => setEditNoteTitle(e.target.value)}
                                                               placeholder="Başlık" />
                                                        <textarea className="bg-[#1a1a23] text-white p-2 rounded-lg mb-3 w-full"
                                                                  rows={5}
                                                                  value={editNoteContent}
                                                                  onChange={e => setEditNoteContent(e.target.value)}
                                                                  placeholder="Not içeriği (Markdown)" />
                                                        <div className="flex gap-2 mt-2">
                                                            <button onClick={() => handleEditNote(note.id)} className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold shadow">Kaydet</button>
                                                            <button onClick={() => setEditNoteId(null)} className="bg-[#191b24] text-gray-300 px-4 py-2 rounded-lg font-bold shadow">Vazgeç</button>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))
                            ) : (
                                <span className="text-gray-500">Not bulunamadı.</span>
                            )}
                        </div>
                        {/* Not ekle */}
                        {activeFolderId && (
                            <div className="mt-auto">
                                <input
                                    type="text"
                                    value={newNoteTitle}
                                    onChange={e => setNewNoteTitle(e.target.value)}
                                    placeholder="Başlık"
                                    className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2 font-bold"
                                />
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    placeholder="Yeni not (Markdown destekli)"
                                    rows={3}
                                    className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2"
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={!newNoteTitle.trim() || !newNote.trim()}
                                    className={`bg-gradient-to-r ${themeGradient} text-white font-bold py-2 px-8 rounded-lg shadow transition hover:scale-105`}
                                >
                                    Not Ekle
                                </button>
                            </div>
                        )}
                    </section>

                    {/* SAĞ AI PANELİ */}
                    <aside className="w-[410px] min-w-[290px] border-l border-[#232338] bg-[#1a1a23] flex flex-col h-full sticky top-0 z-20 p-0">
                        <div className="sticky top-0 z-10 bg-[#1a1a23] border-b border-[#232338] flex items-center gap-2 px-6 pt-6 pb-2">
                            <Sparkles size={28} className="text-[#8B5CF6] animate-spin-slow" />
                            <span className="font-extrabold text-lg bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent tracking-wide">AI Özellikleri</span>
                            {activeNote && (
                                <button onClick={() => setActiveNote(null)}
                                        className="ml-auto px-3 py-1 rounded-lg bg-[#232338] border border-[#8B5CF6] text-[#8B5CF6] text-xs font-bold shadow hover:bg-[#8B5CF6] hover:text-white transition">
                                    Seçimi Kaldır
                                </button>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto">
                            {!activeNote && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", duration: 0.5 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <Sparkles size={40} className="text-[#00fff0] animate-pulse" />
                                        <div className="font-extrabold text-2xl bg-gradient-to-r from-[#8B5CF6] to-[#00fff0] bg-clip-text text-transparent mt-2 mb-1">AI Not Asistanı</div>
                                        <div className="text-gray-400 mb-2 text-sm">Bir not seçersen AI sadece o not için,<br />seçili not yoksa klasörün tamamı için aktifleşir.</div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <AIBox
                                            title="Klasördeki Tüm Notları Özetle"
                                            desc="Tüm notları tek tıkla AI ile özetle, önemli noktaları çıkar."
                                            color="from-[#8B5CF6] to-[#06B6D4]"
                                            icon={<Sparkles size={22} />}
                                            cta="Özetle"
                                        />
                                        <AIBox
                                            title="AI Chat (Klasör)"
                                            desc="Klasördeki notlarla ilgili chatbot asistanı."
                                            color="from-[#00fff0] to-[#8B5CF6]"
                                            icon={<Bot size={21} />}
                                            cta="Sohbet Et"
                                        />
                                        <AIBox
                                            title="Akıllı Arama"
                                            desc="Notlarında anahtar kelime veya konsept arat."
                                            color="from-[#06B6D4] to-[#00fff0]"
                                            icon={<MessageCircle size={21} />}
                                            cta="Ara"
                                        />
                                        <AIBox
                                            title="Sunum Hazırla"
                                            desc="Klasördeki notlardan AI ile otomatik sunum oluştur."
                                            color="from-[#8B5CF6] to-[#F47174]"
                                            icon={<FileText size={21} />}
                                            cta="Hazırla"
                                            badge="beta"
                                        />
                                        <AIBox
                                            title="AI Etiketleme"
                                            desc="Klasör içindeki notları otomatik olarak konuya göre etiketle."
                                            color="from-[#00fff0] to-[#8B5CF6]"
                                            icon={<Sparkles size={19} />}
                                            cta="Etiketle"
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
                                        title="AI Not Özeti"
                                        desc="Seçili notu AI ile özetle, ana noktaları vurgula."
                                        color="from-[#8B5CF6] to-[#06B6D4]"
                                        icon={<Sparkles size={22} />}
                                        cta="Özetle"
                                    />
                                    <AIBox
                                        title="Başlık/Alt Başlık Öner"
                                        desc="AI, daha iyi başlık ve özet önerir."
                                        color="from-[#06B6D4] to-[#00fff0]"
                                        icon={<Edit3 size={20} />}
                                        cta="Öner"
                                    />
                                    <AIBox
                                        title="Markdown Onarımı"
                                        desc="Bozuk veya karmaşık markdown’ı AI ile temizle."
                                        color="from-[#00fff0] to-[#8B5CF6]"
                                        icon={<FileText size={20} />}
                                        cta="Düzelt"
                                    />
                                    <AIBox
                                        title="Not AI Chat"
                                        desc="Bu nota özel chatbot asistanı."
                                        color="from-[#8B5CF6] to-[#F47174]"
                                        icon={<Bot size={20} />}
                                        cta="Sohbet Et"
                                    />
                                    <AIBox
                                        title="Referansları Çıkar"
                                        desc="Not içindeki kaynakları ve referansları AI ile bul."
                                        color="from-[#F47174] to-[#8B5CF6]"
                                        icon={<FileText size={18} />}
                                        cta="Analiz Et"
                                    />
                                    <AIBox
                                        title="Sesli Özetle"
                                        desc="AI, notunu okuyup özet ses dosyası oluşturur."
                                        color="from-[#00fff0] to-[#06B6D4]"
                                        icon={<Bot size={19} />}
                                        cta="Dinle"
                                        badge="yakında"
                                    />
                                </motion.div>
                            )}
                            <div className="mt-8 text-xs text-gray-500 text-center">
                                Tüm AI fonksiyonları canlı renkler ve animasyonlarla — UX tasarımı üst seviye!
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}
