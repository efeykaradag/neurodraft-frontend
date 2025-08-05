import { Note } from "@/types/types";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import { useState } from "react";

interface NoteDetailsProps {
    note: Note;
    folderId: number;  // BURAYI EKLEDİK!
    onUploadFile: (file: File) => void;
}

export default function NoteDetails({ note, folderId, onUploadFile }: NoteDetailsProps) {
    const [files, setFiles] = useState(note.files ?? []);

    // Optionally, onUploadFile dosyayı backend'e gönderip, sonra state'e ekleyebilirsin.

    return (
        <div className="p-2">
            <h3 className="font-bold text-lg mb-2">{note.title}</h3>
            <div className="mb-3 text-sm text-gray-300 whitespace-pre-line">{note.content}</div>
            <FileUpload folderId={folderId} onUpload={onUploadFile} /> {/* Burada folderId kullanılıyor */}
            <FileList files={files} />
        </div>
    );
}
