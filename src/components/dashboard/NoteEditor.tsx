import { Note } from "@/types/types";

interface NoteEditorProps {
    editingNote: Note | null;
    setEditingNote: (note: Note | null) => void;
    onSave: (note: Note) => void;
    onCancel: () => void;
}

export default function NoteEditor({ editingNote, setEditingNote, onSave, onCancel }: NoteEditorProps) {
    if (!editingNote) return null;
    return (
        <div className="mt-auto flex flex-col gap-2">
            <input
                type="text"
                className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2 font-bold"
                value={editingNote.title}
                onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
            />
            <textarea
                rows={3}
                className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2"
                value={editingNote.content}
                onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
            />
            <button
                onClick={() => onSave(editingNote)}
                disabled={!editingNote.title.trim() || !editingNote.content.trim()}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold py-2 px-8 rounded-lg shadow transition hover:scale-105"
            >
                Notu Güncelle
            </button>
            <button
                onClick={onCancel}
                className="bg-[#232338] text-gray-300 py-2 px-8 rounded-lg mt-1"
            >
                Vazgeç
            </button>
        </div>
    );
}
