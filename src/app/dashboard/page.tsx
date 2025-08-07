"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, LogOut } from "lucide-react";
import FolderList from "@/components/dashboard/FolderList";
import NoteGrid from "@/components/dashboard/NoteGrid";
import FileGrid from "@/components/dashboard/FileGrid";
import FileUpload from "@/components/dashboard/FileUpload";
import NewNoteForm from "@/components/dashboard/NewNoteForm";
import AudioNoteForm from "@/components/dashboard/AudioNoteForm";
import NoteEditor from "@/components/dashboard/NoteEditor";
import AIPanel from "@/components/dashboard/AIPanel";
import CustomButton from "@/components/ui/CustomButton";
import Modal from "@/components/modal";
import { Folder, Note, UploadedFile } from "@/types/types";
import { SpeedInsights } from "@vercel/speed-insights/next";
import DemoTimer from "@/components/DemoTimer";

async function apiFetch(url: string, options: RequestInit = {}) {
    return fetch(url, {
        ...options,
        credentials: "include",
        headers: { ...options.headers, "Content-Type": "application/json" },
    });
}

export default function DashboardPage() {
    // STATE
    const [folders, setFolders] = useState<Folder[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [activeFile, setActiveFile] = useState<UploadedFile | null>(null);

    // Modal states
    const [showAddFolder, setShowAddFolder] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const [showAudioModal, setShowAudioModal] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    // Others
    const [editFolderId, setEditFolderId] = useState<number | null>(null);
    const [editFolderName, setEditFolderName] = useState("");
    const [showDeleteFolderId, setShowDeleteFolderId] = useState<number | null>(null);
    const [showDeleteNoteId, setShowDeleteNoteId] = useState<number | null>(null);
    const [showDeleteFileId, setShowDeleteFileId] = useState<number | null>(null);

    const [newFolderName, setNewFolderName] = useState("");
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteContent, setNewNoteContent] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Giriş kontrolü
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, { credentials: "include" })
            .then(res => { if (!res.ok) router.replace("/login"); });
    }, [router]);

    // FOLDER FETCH
    const fetchFolders = async () => {
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders`);
        if (res.ok) {
            const data: Folder[] = await res.json();
            setFolders(data);
            // Eğer klasör seçili değilse veya silindiyse, ilk klasöre geç
            if ((!activeFolderId || !data.some(f => f.id === activeFolderId)) && data.length) {
                setActiveFolderId(data[0].id);
            }
        }
        setLoading(false);
    };

    // KLASÖR DEĞİŞİNCE İÇERİK FETCH
    const fetchContents = async (folderId = activeFolderId) => {
        if (!folderId) return;
        setLoading(true);
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}/contents`);
        if (res.ok) {
            const data = await res.json();
            setNotes(data.notes);
            setFiles(data.files);
        }
        setLoading(false);
    };

    // Mount olduğunda KLASÖRLERİ ÇEK
    useEffect(() => { fetchFolders(); }, []);

    // Aktif klasör değişince içeriği çek
    useEffect(() => { if (activeFolderId) fetchContents(activeFolderId); }, [activeFolderId]);

    // CRUD FONKSİYONLARI --- her işlemden sonra ilgili fetch fonksiyonunu çağır!
    const handleAddFolder = async () => {
        if (!newFolderName.trim()) return;
        setLoading(true);
        await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders`, {
            method: "POST", body: JSON.stringify({ name: newFolderName }),
        });
        setNewFolderName(""); setShowAddFolder(false);
        await fetchFolders();
        setLoading(false);
    };
    const handleEditFolder = async (folderId: number) => {
        if (!editFolderName.trim()) return;
        await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}`, {
            method: "PATCH", body: JSON.stringify({ name: editFolderName }),
        });
        setEditFolderId(null); setEditFolderName("");
        await fetchFolders();
    };
    const handleDeleteFolder = async (folderId: number) => {
        await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}`, { method: "DELETE" });
        setShowDeleteFolderId(null);
        await fetchFolders();
    };

    const handleAddNote = async () => {
        if (!newNoteTitle.trim() || !newNoteContent.trim() || !activeFolderId) return;
        setLoading(true);
        await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${activeFolderId}/notes`, {
            method: "POST", body: JSON.stringify({ title: newNoteTitle, content: newNoteContent }),
        });
        setNewNoteTitle(""); setNewNoteContent(""); setShowNoteModal(false);
        await fetchContents();
        setLoading(false);
    };
    const handleDeleteNote = async (noteId: number) => {
        setLoading(true);
        await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`, { method: "DELETE" });
        setShowDeleteNoteId(null);
        setActiveNote(null);
        await fetchContents();
        setLoading(false);
    };
    const handleEditNote = async (note: Note) => {
        setLoading(true);
        await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${note.id}`, {
            method: "PATCH", body: JSON.stringify({ title: note.title, content: note.content }),
        });
        setEditingNote(null);
        await fetchContents();
        setLoading(false);
    };

    const handleFileUpload = async (file: File) => {
        if (!activeFolderId) return;
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${activeFolderId}/files`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        setShowFileModal(false);
        await fetchContents();
        setLoading(false);
    };
    const handleDeleteFile = async (fileId: number) => {
        if (!window.confirm("Bu dosyayı silmek istediğinizden emin misiniz?")) return;
        setLoading(true);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
            method: "DELETE",
            credentials: "include",
        });
        setShowDeleteFileId(null);
        await fetchContents();
        setLoading(false);
    };
    const handleFileTitleEdit = async (fileId: number, newTitle: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
            method: "PATCH",
            body: JSON.stringify({ title: newTitle }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        await fetchContents();
    };

    // Çıkış
    const handleLogout = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, { method: "POST", credentials: "include" });
        window.location.href = "/";
    };

    // Tema
    const themeGradient = "from-[#8B5CF6] via-[#06B6D4] to-[#00fff0]";

    // --- RENDER ---
    return (
        <div className="w-full min-h-screen flex flex-col bg-[#18181b]">
            <DemoTimer />
            {/* HEADER */}
            <header className="flex items-center justify-between px-6 md:px-12 py-4 bg-[#232338] shadow">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-lg" />
                    <span className={`text-xl md:text-2xl font-extrabold bg-gradient-to-r ${themeGradient} bg-clip-text text-transparent`}>NeuroDrafts</span>
                </div>
                <div className="flex items-center gap-4">
                    <User className="text-[#8B5CF6] w-7 h-7" />
                    <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 bg-[#191b24] rounded-lg text-gray-300 hover:text-white text-sm">
                        <LogOut className="w-4 h-4 mr-1" /> Çıkış Yap
                    </button>
                </div>
            </header>

            {/* ANA GRID */}
            <div className="flex-1 flex bg-[#18181b] overflow-x-auto">
                {/* SIDEBAR */}
                <FolderList
                    folders={folders}
                    activeFolderId={activeFolderId}
                    onSelect={setActiveFolderId}
                    onEdit={folder => { setEditFolderId(folder.id); setEditFolderName(folder.name); }}
                    onDelete={handleDeleteFolder}
                    showDeleteId={showDeleteFolderId}
                    setShowDeleteId={setShowDeleteFolderId}
                    editFolderId={editFolderId}
                    editFolderName={editFolderName}
                    setEditFolderId={setEditFolderId}
                    setEditFolderName={setEditFolderName}
                    handleEditFolder={handleEditFolder}
                    onShowAddFolder={() => setShowAddFolder(true)}
                />

                {/* ANA İÇERİK & AI */}
                <div className="flex-1 flex flex-col lg:flex-row gap-0 min-h-0">
                    {/* NOTLAR ve BUTONLAR */}
                    <section className="flex flex-col flex-1 min-w-0">
                        {/* NOTLAR */}
                        <div className="flex-1 bg-[#232338] rounded-t-2xl shadow-xl p-4 md:p-7 min-h-[300px] flex flex-col mb-0 mt-2 ml-2 mr-2">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="text-xl font-bold">
                                    Notlar {folders.find(f => f.id === activeFolderId)?.name && `(${folders.find(f => f.id === activeFolderId)?.name})`}
                                </span>
                            </div>
                            <NoteGrid
                                notes={notes}
                                activeNote={activeNote}
                                setActiveNote={setActiveNote}
                                onEdit={setEditingNote}
                                onDelete={handleDeleteNote}
                                showDeleteNoteId={showDeleteNoteId}
                                setShowDeleteNoteId={setShowDeleteNoteId}
                                editNoteId={editingNote?.id ?? null}
                                setEditNoteId={id => setEditingNote(notes.find(n => n.id === id) || null)}
                            />
                            <FileGrid
                                files={files}
                                activeFile={activeFile}
                                setActiveFile={setActiveFile}
                                onFileTitleEdit={handleFileTitleEdit}
                                onDelete={handleDeleteFile}
                                showDeleteFileId={showDeleteFileId}
                                setShowDeleteFileId={setShowDeleteFileId}
                            />
                        </div>
                        {/* ALT BAR - BUTONLAR */}
                        <div className="flex flex-col md:flex-row gap-5 bg-[#232338] rounded-b-2xl shadow-xl px-4 py-6 md:py-6 ml-2 mr-2">
                            <CustomButton className="flex-1" onClick={() => setShowNoteModal(true)}>
                                Not Ekle
                            </CustomButton>
                            <CustomButton className="flex-1" onClick={() => setShowFileModal(true)}>
                                Dosya Ekle
                            </CustomButton>
                            <CustomButton className="flex-1" onClick={() => setShowAudioModal(true)}>
                                Sesli Not
                            </CustomButton>
                        </div>
                    </section>
                    {/* AI PANEL */}
                    <aside className="w-full lg:w-[400px] max-w-[500px] flex-shrink-0 bg-[#1a1a23] border-l border-[#232338] flex flex-col min-h-0 rounded-2xl lg:rounded-l-none shadow-xl">
                        <AIPanel setActiveFile={setActiveFile} activeFile={activeFile} activeNote={activeNote} setActiveNote={setActiveNote} activeFolderId={activeFolderId}/>
                    </aside>
                </div>
            </div>

            {/* Klasör ekleme input'u modali */}
            {showAddFolder && (
                <Modal onClose={() => setShowAddFolder(false)}>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            className="bg-[#1a1a23] text-white p-2 rounded-lg"
                            placeholder="Yeni klasör adı"
                            value={newFolderName}
                            onChange={e => setNewFolderName(e.target.value)}
                            autoFocus
                        />
                        <button
                            className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold py-2 rounded-lg shadow transition"
                            onClick={handleAddFolder}
                        >Ekle</button>
                        <button
                            className="bg-[#191b24] text-gray-300 px-4 py-2 rounded-lg font-bold shadow"
                            onClick={() => setShowAddFolder(false)}
                        >Vazgeç</button>
                    </div>
                </Modal>
            )}

            {/* NOT EKLE POPUP */}
            {showNoteModal && (
                <Modal onClose={() => setShowNoteModal(false)}>
                    <NewNoteForm
                        newNoteTitle={newNoteTitle}
                        setNewNoteTitle={setNewNoteTitle}
                        newNoteContent={newNoteContent}
                        setNewNoteContent={setNewNoteContent}
                        onAdd={handleAddNote}
                        onCancel={() => setShowNoteModal(false)}
                    />
                </Modal>
            )}

            {/* DOSYA EKLE POPUP */}
            {showFileModal && (
                <Modal onClose={() => setShowFileModal(false)}>
                    <FileUpload
                        folderId={activeFolderId!}
                        onUpload={handleFileUpload}
                    />
                </Modal>
            )}
            {/* SESLİ NOT EKLE POPUP */}
            {showAudioModal && (
                <Modal onClose={() => setShowAudioModal(false)}>
                    <AudioNoteForm
                        onAdd={handleFileUpload}
                        onCancel={() => setShowAudioModal(false)}
                    />
                </Modal>
            )}

            {/* NOT DÜZENLEME (EDIT) POPUP */}
            {editingNote && (
                <Modal onClose={() => setEditingNote(null)}>
                    <NoteEditor
                        editingNote={editingNote}
                        setEditingNote={setEditingNote}
                        onSave={handleEditNote}
                        onCancel={() => setEditingNote(null)}
                    />
                </Modal>
            )}
        </div>

    );
}
<SpeedInsights/>

