import { useRef } from "react";
import CustomButton from "@/components/ui/CustomButton";


interface FileUploadProps {
    folderId: number;
    noteId?: number;
    onUpload: (file: File) => void;
    className?: string;            // dışarıdan styling
    buttonClassName?: string;      // buton için styling
    buttonText?: string;           // buton üzerinde gösterilecek yazı

}

export default function FileUpload({

                                       noteId,
                                       onUpload,
                                       className = "ml-5 mr-5",
                                       buttonClassName = "",
                                       buttonText
                                   }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="file"
                onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                        onUpload(e.target.files[0]);
                    }
                }}
                className="hidden"
            />
            <CustomButton
                onClick={() => inputRef.current?.click()}
                className={buttonClassName}
                variant="secondary"
            >
                {buttonText || (noteId ? "Nota Dosya Ekle" : "Dosya Ekle")}
            </CustomButton>
        </div>
    );
}
