import { useState } from "react";

interface AINoteFormProps {
    onAdd: (content: string) => void;
    onCancel: () => void;
}

export default function AINoteForm({ onAdd, onCancel }: AINoteFormProps) {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setLoading(true);

        // Burada AI backend’e prompt gönderip yanıtı alabilirsin.
        // Şimdilik prompt’ı döndürüp ekliyoruz.
        onAdd(prompt);

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <label className="font-semibold text-lg mb-1 text-white">AI ile Not Oluştur</label>
            <textarea
                className="bg-[#191b24] text-white p-3 rounded-lg w-full min-h-[90px] resize-y"
                placeholder="Notun için AI'ya yaz: örn. 'Yapay zeka ile özet çıkar.'"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={loading}
                autoFocus
            />
            <div className="flex gap-3 mt-2">
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold px-4 py-2 rounded-lg shadow w-full"
                >
                    AI Notu Ekle
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-[#191b24] text-gray-300 font-bold px-4 py-2 rounded-lg w-full border border-[#8B5CF6]"
                >
                    Vazgeç
                </button>
            </div>
        </form>
    );
}
