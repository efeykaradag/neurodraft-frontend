import { useRef, useState } from "react";
type FileUploadProps = {
    folderId: number;
    onUpload: (file: File[]) => void;
};


export default function FileUpload({ folderId, onUpload }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_id", folderId.toString());

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folderId}/files`, {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        setUploading(false);
        fileInput.current!.value = "";
        if (res.ok) {
            const data = await res.json();
            onUpload(data);
        } else {
            alert("Dosya yüklenemedi!");
        }
    };

    return (
        <div>
            <input
                ref={fileInput}
                type="file"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
                accept="image/*,application/pdf,audio/*,video/*"
            />
            <button
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white px-4 py-2 rounded-lg"
            >
                {uploading ? "Yükleniyor..." : "Dosya Yükle"}
            </button>
        </div>
    );
}
