import { Note, UploadedFile } from "@/types/types";
import ReactMarkdown from "react-markdown";
import { Edit3, Trash2, FileText, Bot, X, Save, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface NoteGridProps {
    notes?: Note[];
    files?: UploadedFile[];
    activeNote: Note | null;
    setActiveNote: (note: Note | null) => void;
    onEdit?: (note: Note) => void;
    onDelete?: (id: number) => void;
    showDeleteNoteId?: number | null;
    setShowDeleteNoteId?: (id: number | null) => void;
    editNoteId?: number | null;
    setEditNoteId?: (id: number | null) => void;
    onFileTitleEdit?: (fileId: number, newTitle: string) => void;
}

export default function NoteGrid({
                                     notes = [],
                                     files = [],
                                     activeNote,
                                     setActiveNote,
                                     onEdit,
                                     onDelete,
                                     showDeleteNoteId,
                                     setShowDeleteNoteId,
                                     onFileTitleEdit,
                                 }: NoteGridProps) {
    const [editingFileId, setEditingFileId] = useState<number | null>(null);
    const [fileTitleDraft, setFileTitleDraft] = useState<string>("");
    const [showFullNote, setShowFullNote] = useState<Note | null>(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5 mb-3 flex-1">
            {/* NOTE CARDS */}
            {notes.length > 0 ? (
                notes.map((note) => {
                    const isLong = note.content.length > 250;
                    const preview = isLong ? note.content.slice(0, 50) + "…" : note.content;
                    return (
                        <motion.div
                            key={`note-${note.id}`}
                            className={`
                group relative rounded-2xl bg-[#1a1a23] shadow-xl cursor-pointer border-2 transition-all duration-200 flex flex-col
                min-h-[180px] aspect-square p-4 md:p-5
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
                            <div className="text-gray-400 text-xs mb-2">
                                {new Date(note.created_at).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-100 flex-1 overflow-hidden line-clamp-5">
                                <ReactMarkdown>{preview}</ReactMarkdown>
                                {isLong && (
                                    <button
                                        className="text-xs text-cyan-400 underline mt-2"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowFullNote(note);
                                        }}
                                    >
                                        Devamını gör
                                    </button>
                                )}
                            </div>
                            <div className="absolute bottom-3 right-4 flex gap-2">
                                {onEdit && (
                                    <button
                                        onClick={e => { e.stopPropagation(); onEdit(note); }}
                                        title="Düzenle"
                                        className="text-cyan-400 hover:scale-110"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                )}
                                {onDelete && setShowDeleteNoteId && (
                                    <button
                                        onClick={e => { e.stopPropagation(); setShowDeleteNoteId(note.id); }}
                                        title="Sil"
                                        className="text-[#F47174] hover:scale-110"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={e => { e.stopPropagation(); setActiveNote(note); }}
                                    title="AI Asistan"
                                    className="text-[#00fff0] opacity-70 group-hover:opacity-100 hover:scale-125 transition"
                                >
                                    <Bot size={19} />
                                </button>
                            </div>
                            {/* Sil modalı */}
                            <AnimatePresence>
                                {showDeleteNoteId === note.id && onDelete && setShowDeleteNoteId && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                        <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 20 }} transition={{ type: "spring" }}
                                                    className="bg-[#232338] rounded-xl shadow-2xl p-8 w-full max-w-xs text-center border border-[#8B5CF6]">
                                            <div className="text-xl font-bold text-[#F47174] mb-3">Notu silmek istediğine emin misin?</div>
                                            <div className="flex justify-center gap-4 mt-4">
                                                <button className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold shadow"
                                                        onClick={() => onDelete(note.id)}>
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
                        </motion.div>
                    );
                })
            ) : (
                <span className="text-gray-500">Not bulunamadı.</span>
            )}

            {/* FULL NOTE MODAL */}
            <AnimatePresence>
                {showFullNote && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFullNote(null)}
                    >
                        <motion.div
                            className="bg-[#232338] rounded-2xl shadow-2xl p-7 min-w-[340px] max-w-xl w-full mx-2 relative"
                            initial={{ scale: 0.96, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.96, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowFullNote(null)}
                                className="absolute top-4 right-4 text-2xl text-white/60 hover:text-white"
                            >×</button>
                            <div className="font-bold text-xl mb-2">{showFullNote.title}</div>
                            <div className="text-gray-400 text-xs mb-5">
                                {new Date(showFullNote.created_at).toLocaleString()}
                            </div>
                            <div className="prose prose-invert max-w-none whitespace-pre-line text-base text-gray-100" style={{ maxHeight: "50vh", overflowY: "auto" }}>
                                <ReactMarkdown>{showFullNote.content}</ReactMarkdown>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FILE CARDS (Aynen bırakabilirsin, gerekirse kısaltırım) */}
            {files.length > 0 && files.map((file) => (
                <motion.div
                    key={`file-${file.id}`}
                    className={`
            group relative rounded-2xl bg-[#191b24] shadow-xl border-2 transition-all duration-200 flex flex-col
            min-h-[180px] aspect-square p-4 md:p-5 border-transparent hover:border-[#06B6D4]/40 hover:shadow-lg
            cursor-pointer
          `}
                    whileHover={{ scale: 1.04, y: -2, boxShadow: "0 8px 32px 0 #06B6D499" }}
                    onClick={() => setActiveNote(file as any)}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <FileText size={20} className="text-[#8B5CF6]" />
                        {editingFileId === file.id ? (
                            <input
                                className="font-bold text-base truncate bg-transparent border-b-2 border-[#8B5CF6] px-1 text-white"
                                value={fileTitleDraft}
                                onChange={e => setFileTitleDraft(e.target.value)}
                                autoFocus
                                onClick={e => e.stopPropagation()}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && onFileTitleEdit) {
                                        onFileTitleEdit(file.id, fileTitleDraft);
                                        setEditingFileId(null);
                                    }
                                    if (e.key === "Escape") {
                                        setEditingFileId(null);
                                    }
                                }}
                            />
                        ) : (
                            <span className="font-bold text-base truncate" onDoubleClick={e => {
                                e.stopPropagation();
                                setEditingFileId(file.id);
                                setFileTitleDraft(file.title || file.filename);
                            }}>
                {file.title || file.filename}
              </span>
                        )}
                    </div>
                    <div className="text-gray-400 text-xs mb-2">{new Date(file.uploaded_at).toLocaleString()}</div>
                    <div className="text-sm text-gray-300 flex-1 overflow-hidden line-clamp-5">
                        {file.filename}
                    </div>
                    <div className="absolute bottom-3 right-4 flex gap-2">
                        {editingFileId === file.id && (
                            <>
                                <button
                                    className="text-cyan-400 hover:scale-110"
                                    title="Kaydet"
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (onFileTitleEdit) {
                                            onFileTitleEdit(file.id, fileTitleDraft);
                                            setEditingFileId(null);
                                        }
                                    }}
                                >
                                    <Save size={16} />
                                </button>
                                <button
                                    className="text-[#F47174] hover:scale-110"
                                    title="İptal"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setEditingFileId(null);
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </>
                        )}
                        {onFileTitleEdit && editingFileId !== file.id && (
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setEditingFileId(file.id);
                                    setFileTitleDraft(file.title || file.filename);
                                }}
                                title="Başlığı Düzenle"
                                className="text-cyan-400 hover:scale-110"
                            >
                                <Edit3 size={16} />
                            </button>
                        )}
                        {onDelete && setShowDeleteNoteId && (
                            <button
                                onClick={e => { e.stopPropagation(); setShowDeleteNoteId(file.id); }}
                                title="Sil"
                                className="text-[#F47174] hover:scale-110"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <button
                            onClick={e => { e.stopPropagation(); setActiveNote(file as any); }}
                            title="AI Asistan"
                            className="text-[#00fff0] opacity-70 group-hover:opacity-100 hover:scale-125 transition"
                        >
                            <Bot size={19} />
                        </button>
                    </div>
                    <AnimatePresence>
                        {showDeleteNoteId === file.id && onDelete && setShowDeleteNoteId && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 20 }} transition={{ type: "spring" }}
                                            className="bg-[#232338] rounded-xl shadow-2xl p-8 w-full max-w-xs text-center border border-[#8B5CF6]">
                                    <div className="text-xl font-bold text-[#F47174] mb-3">Dosyayı silmek istediğine emin misin?</div>
                                    <div className="flex justify-center gap-4 mt-4">
                                        <button className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold shadow"
                                                onClick={() => onDelete(file.id)}>
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
                </motion.div>
            ))}
        </div>
    );
}
