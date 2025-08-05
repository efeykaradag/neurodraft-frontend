import { Folder } from "@/types/types";
import { Pencil, Trash2, Check, X, FolderPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FolderListProps {
    folders: Folder[];
    activeFolderId: number | null;
    onSelect: (id: number) => void;
    onEdit?: (folder: Folder) => void;
    onDelete?: (id: number) => void;
    showDeleteId?: number | null;
    setShowDeleteId?: (id: number | null) => void;
    editFolderId?: number | null;
    editFolderName?: string;
    setEditFolderId?: (id: number | null) => void;
    setEditFolderName?: (v: string) => void;
    handleEditFolder?: (id: number) => void;
    onShowAddFolder?: () => void;
}

export default function FolderList({
                                       folders,
                                       activeFolderId,
                                       onSelect,
                                       onEdit,
                                       onDelete,
                                       showDeleteId,
                                       setShowDeleteId,
                                       editFolderId,
                                       editFolderName,
                                       setEditFolderId,
                                       setEditFolderName,
                                       handleEditFolder,
                                       onShowAddFolder,
                                   }: FolderListProps) {
    return (
        <aside className="w-60 md:w-72 flex-shrink-0 bg-[#232338] border-r border-[#191b24] flex flex-col py-7 px-3 md:px-5">
            <div className="flex justify-between items-center mb-5">
                <span className="text-base md:text-lg font-bold text-gray-300">Klasörler</span>
                <button
                    className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#00fff0] p-1.5 rounded-xl text-white"
                    title="Klasör Ekle"
                    onClick={onShowAddFolder}
                >
                    <FolderPlus size={20} />
                </button>
            </div>
            <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
                {folders.length === 0 && <span className="text-gray-500">Klasör yok.</span>}
                {folders.map((folder) => (
                    <motion.div key={folder.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={`group flex items-center justify-between px-3 py-2 rounded-lg transition font-medium ${folder.id === activeFolderId ? "bg-gradient-to-r from-[#8B5CF6]/80 to-[#06B6D4]/80 text-white shadow" : "text-gray-300 hover:bg-[#191b24]"}`}>
                            {editFolderId === folder.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                    <input
                                        className="bg-[#191b24] text-white p-1 px-2 rounded"
                                        value={editFolderName}
                                        onChange={e => setEditFolderName?.(e.target.value)}
                                        autoFocus
                                        onKeyDown={e => e.key === "Enter" && handleEditFolder?.(folder.id)}
                                    />
                                    <button onClick={() => handleEditFolder?.(folder.id)} className="text-green-400"><Check size={18} /></button>
                                    <button onClick={() => setEditFolderId?.(null)} className="text-gray-400"><X size={18} /></button>
                                </div>
                            ) : (
                                <button className="flex-1 text-left truncate" onClick={() => onSelect(folder.id)}>
                                    {folder.name}
                                </button>
                            )}
                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition">
                                {setEditFolderId && setEditFolderName && (
                                    <button title="Düzenle" onClick={() => { setEditFolderId(folder.id); setEditFolderName(folder.name); }}>
                                        <Pencil size={16} className="text-cyan-400" />
                                    </button>
                                )}
                                {setShowDeleteId && (
                                    <button title="Sil" onClick={() => setShowDeleteId(folder.id)}>
                                        <Trash2 size={16} className="text-[#F47174]" />
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Silme modalı */}
                        <AnimatePresence>
                            {showDeleteId === folder.id && onDelete && setShowDeleteId && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                    <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 20 }} transition={{ type: "spring" }}
                                                className="bg-[#232338] rounded-xl shadow-2xl p-8 w-full max-w-xs text-center border border-[#8B5CF6]">
                                        <div className="text-xl font-bold text-[#F47174] mb-3">Klasörü silmek istediğine emin misin?</div>
                                        <div className="flex justify-center gap-4 mt-4">
                                            <button className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold shadow"
                                                    onClick={() => onDelete(folder.id)}>
                                                Sil
                                            </button>
                                            <button className="bg-[#191b24] text-gray-300 px-4 py-2 rounded-lg font-bold shadow"
                                                    onClick={() => setShowDeleteId(null)}>
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
        </aside>
    );
}
