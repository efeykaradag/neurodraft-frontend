import { UploadedFile } from "@/types/types";
import { Edit3, Trash2, FileText, Bot, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface FileGridProps {
    files: UploadedFile[];
    activeFile: UploadedFile | null;
    setActiveFile: (file: UploadedFile | null) => void;
    onFileTitleEdit?: (fileId: number, newTitle: string) => void;
    onDelete?: (id: number) => void;
    showDeleteFileId?: number | null;
    setShowDeleteFileId?: (id: number | null) => void;
}

export default function FileGrid({
                                     files,
                                     activeFile,
                                     setActiveFile,
                                     onFileTitleEdit,
                                     onDelete,
                                     showDeleteFileId,
                                     setShowDeleteFileId,
                                 }: FileGridProps) {
    const [editingFileId, setEditingFileId] = useState<number | null>(null);
    const [fileTitleDraft, setFileTitleDraft] = useState<string>("");
    const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Dosya önizleme (PDF/ZIP ise blob, diğerlerinde doğrudan url)
    const handleQuickLook = async (file: UploadedFile) => {
        const type = file.filetype || file.type || "";
        if (type.includes("pdf") || file.filename.endsWith(".zip")) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${file.id}/preview`, {
                    credentials: "include"
                });
                if (!res.ok) {
                    alert("Dosya önizlenemiyor!");
                    return;
                }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setPreviewFile(file);
            } catch {
                alert("Dosya önizlenirken hata oluştu!");
            }
        } else {
            setPreviewUrl(null);
            setPreviewFile(file);
        }
    };

    function getFileUrl(file: UploadedFile) {
        if (file.filepath) {
            if (file.filepath.startsWith("uploaded_files/")) {
                return `${process.env.NEXT_PUBLIC_API_URL}/${file.filepath}`;
            }
            if (file.filepath.startsWith("/uploaded_files/")) {
                return `${process.env.NEXT_PUBLIC_API_URL}${file.filepath}`;
            }
        }
        return `${process.env.NEXT_PUBLIC_API_URL}/uploaded_files/${encodeURIComponent(file.filename)}`;
    }

    function getFileType(file: UploadedFile) {
        return file.filetype || file.type || "";
    }

    return (
        <>
            <div>
                <h3 className="font-semibold mb-2 text-lg">Dosyalar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5 mb-3 flex-1">
                    {files.length > 0 ? files.map((file) => (
                        <motion.div
                            key={`file-${file.id}`}
                            className={`
                                group relative rounded-2xl bg-[#191b24] shadow-xl border-2 transition-all duration-200 flex flex-col
                                min-h-[180px] aspect-square p-4 md:p-5
                                cursor-pointer
                                ${activeFile?.id === file.id
                                ? "border-[#00fff0] shadow-[0_4px_24px_#00fff055] scale-[1.045]"
                                : "border-transparent hover:border-[#06B6D4]/40 hover:shadow-lg"}
                            `}
                            whileHover={{ scale: 1.04, y: -2, boxShadow: "0 8px 32px 0 #06B6D499" }}
                            onClick={() => setActiveFile(file)}
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
                                            if (e.key === "Escape") setEditingFileId(null);
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
                                <button
                                    onClick={e => { e.stopPropagation(); handleQuickLook(file); }}
                                    className="px-2 py-1 text-xs rounded bg-cyan-800 text-cyan-100 hover:bg-cyan-600"
                                >
                                    Quick Look
                                </button>
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
                                {onDelete && setShowDeleteFileId && (
                                    <button
                                        onClick={e => { e.stopPropagation(); setShowDeleteFileId(file.id); }}
                                        title="Sil"
                                        className="text-[#F47174] hover:scale-110"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={e => { e.stopPropagation(); setActiveFile(file); }}
                                    title="AI Asistan"
                                    className="text-[#00fff0] opacity-70 group-hover:opacity-100 hover:scale-125 transition"
                                >
                                    <Bot size={19} />
                                </button>
                            </div>
                            <AnimatePresence>
                                {showDeleteFileId === file.id && onDelete && setShowDeleteFileId && (
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
                                                        onClick={() => setShowDeleteFileId(null)}>
                                                    Vazgeç
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )) : (
                        <span className="text-gray-500">Dosya bulunamadı.</span>
                    )}
                </div>
            </div>

            {/* QUICK LOOK MODALI */}
            <AnimatePresence>
                {previewFile && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#232338] rounded-2xl shadow-2xl p-7 max-w-2xl w-full mx-4 relative"
                            initial={{ scale: 0.97, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 30 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-2xl text-white/60 hover:text-white"
                                onClick={() => { setPreviewFile(null); setPreviewUrl(null); }}
                            >
                                <X />
                            </button>
                            <div className="font-bold text-lg mb-4">{previewFile.title || previewFile.filename}</div>
                            <div className="text-xs text-gray-400 mb-4">
                                {new Date(previewFile.uploaded_at).toLocaleString()} | {getFileType(previewFile)}
                            </div>
                            {/* --- Dosya türüne göre Önizleme --- */}
                            {getFileType(previewFile).startsWith("image/") && (
                                <img
                                    src={getFileUrl(previewFile)}
                                    alt={previewFile.title || previewFile.filename}
                                    className="max-h-150 rounded-xl mx-auto border"
                                    onError={e => { e.currentTarget.style.opacity = "0.4"; e.currentTarget.alt = "Yüklenemedi"; }}
                                />
                            )}
                            {getFileType(previewFile).startsWith("audio/") && (
                                <audio controls className="w-full my-6">
                                    <source src={getFileUrl(previewFile)} type={getFileType(previewFile)} />
                                    Tarayıcınız audio oynatmayı desteklemiyor.
                                </audio>
                            )}
                            {previewUrl && getFileType(previewFile).includes("pdf") && (
                                <object
                                    data={previewUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height="800px"
                                    className="rounded-xl border mb-2"
                                >
                                    <embed src={previewUrl} type="application/pdf" width="100%" height="400px" />
                                    <div>PDF dosyasını burada görüntüleyemiyorsan <a href={previewUrl} download>indir</a>.</div>
                                </object>
                            )}

                            {/* Diğer dosya türleri için indir linki */}
                            {!(
                                getFileType(previewFile).startsWith("image/") ||
                                getFileType(previewFile).startsWith("audio/") ||
                                getFileType(previewFile).includes("pdf")
                            ) && (
                                <div className="flex flex-col items-center text-gray-400">
                                    <FileText size={48} className="mb-2" />
                                    <span>{previewFile.filename}</span>
                                    <a
                                        href={getFileUrl(previewFile)}
                                        download
                                        className="mt-2 px-3 py-1 bg-cyan-700 rounded text-white text-xs hover:bg-cyan-600"
                                    >
                                        Dosyayı İndir
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
