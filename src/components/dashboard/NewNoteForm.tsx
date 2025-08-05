interface NewNoteFormProps {
    newNoteTitle: string;
    setNewNoteTitle: (v: string) => void;
    newNoteContent: string;
    setNewNoteContent: (v: string) => void;
    onAdd: (title: string, content: string) => void;
    onCancel: () => void;
}


export default function NewNoteForm({ newNoteTitle, setNewNoteTitle, newNoteContent, setNewNoteContent, onAdd }: NewNoteFormProps) {
    return (
        <div className="mt-auto flex flex-col gap-2">
            <input
                type="text"
                placeholder="Başlık"
                className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2 font-bold"
                value={newNoteTitle}
                onChange={e => setNewNoteTitle(e.target.value)}
            />
            <textarea
                placeholder="Yeni not (Markdown destekli)"
                rows={3}
                className="w-full bg-[#1a1a23] text-white p-3 rounded-lg mb-2"
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
            />
            <button
                onClick={() => onAdd(newNoteTitle, newNoteContent)}
                disabled={!`${newNoteTitle ?? ""}`.trim() || !`${newNoteContent ?? ""}`.trim()}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold py-2 px-8 rounded-lg shadow transition hover:scale-105"
            >
                Not Ekle
            </button>
        </div>
    );
}
