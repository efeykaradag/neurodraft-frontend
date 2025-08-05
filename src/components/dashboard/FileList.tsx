import { FileModel } from "@/types/types";
import { FileText, ImageIcon, Music, FileIcon } from "lucide-react";

interface FileListProps {
    files: FileModel[];
}

function getIcon(type: string) {
    if (type.startsWith("image")) return <ImageIcon size={16} className="text-cyan-400" />;
    if (type.startsWith("audio")) return <Music size={16} className="text-purple-400" />;
    if (type === "application/pdf") return <FileIcon size={16} className="text-red-500" />;
    return <FileText size={16} className="text-gray-300" />;
}

export default function FileList({ files }: FileListProps) {
    if (!files || !files.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {files.map(file => (
                <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#232338] border rounded-lg px-2 py-1 text-xs flex items-center gap-2 hover:bg-[#1a1a23]"
                >
                    {getIcon(file.type)}
                    {file.name}
                </a>
            ))}
        </div>
    );
}
