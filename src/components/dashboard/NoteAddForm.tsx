import { useState } from "react";
import FileUpload from "./FileUpload";
import { FileModel } from "@/types/types";

interface NoteAddFormProps {
    folderId: number | null;
    onAdd: (note: { title: string, content: string, files: File[] }) => void;
}

export default function NoteAddForm({ folderId, onAdd }: NoteAddFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content && folderId) {
            onAdd({ title, content, files });
            setTitle("");
            setContent("");
            setFiles([]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-auto">
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Başlık"
                className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2 font-bold"
            />
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Yeni not (Markdown destekli)"
                rows={3}
                className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2"
            />
            <FileUpload
                folderId={folderId!}
                onUpload={file => setFiles(f => [...f, file])}
            />
            <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                    <span key={i} className="bg-[#8B5CF6]/20 text-xs text-[#8B5CF6] rounded-md px-2 py-1">{f.name}</span>
                ))}
            </div>
            <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold py-2 px-8 rounded-lg shadow transition hover:scale-105"
            >
                Not Ekle
            </button>
        </form>
    );
}
