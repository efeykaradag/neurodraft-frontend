// components/dashboard/NoteAddModal.tsx
import React from "react";

interface NoteAddModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (title: string, content: string) => void;
}

export default function NoteAddModal({ open, onClose, onAdd }: NoteAddModalProps) {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-[#232338] p-7 rounded-xl shadow-xl border border-[#8B5CF6] flex flex-col gap-3 w-full max-w-lg">
                <h3 className="text-lg font-bold text-cyan-400 mb-1">Yeni Not Ekle</h3>
                <input
                    className="bg-[#191b24] text-white p-2 rounded mb-1 font-bold"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Başlık"
                />
                <textarea
                    className="bg-[#191b24] text-white p-2 rounded mb-2"
                    rows={4}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Not içeriği (Markdown destekli)"
                />
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={() => { onAdd(title, content); setTitle(""); setContent(""); onClose(); }}
                        disabled={!title.trim() || !content.trim()}
                        className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold shadow"
                    >Ekle</button>
                    <button
                        onClick={onClose}
                        className="bg-[#191b24] text-gray-300 px-4 py-2 rounded-lg font-bold shadow"
                    >Vazgeç</button>
                </div>
            </div>
        </div>
    );
}
