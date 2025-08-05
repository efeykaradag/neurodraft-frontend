import { useRef, useState } from "react";

interface AudioNoteFormProps {
    onAdd: (audioFile: File) => void;
    onCancel: () => void;
}

export default function AudioNoteForm({ onAdd, onCancel }: AudioNoteFormProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        setLoading(true);

        // API’ye gönderebilirsin
        onAdd(selectedFile);

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <label className="font-semibold text-lg mb-1 text-white">Sesli Not Ekle</label>
            <input
                ref={inputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <button
                type="button"
                className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg shadow"
                onClick={() => inputRef.current?.click()}
            >
                {selectedFile ? "Ses Dosyası Seçildi" : "Ses Dosyası Yükle"}
            </button>
            <div className="flex gap-3 mt-2">
                <button
                    type="submit"
                    disabled={loading || !selectedFile}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold px-4 py-2 rounded-lg shadow w-full"
                >
                    Sesli Notu Ekle
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
