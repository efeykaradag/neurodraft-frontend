// types.ts

export interface Folder {
    id: number;
    name: string;
    created_at: string;
}

export interface Note {
    id: number;
    folder_id: number;
    title: string;
    content: string;
    created_at: string;
    files?: FileModel[];
}

export interface FileModel {
    id: number;
    name: string;
    url: string;
    type: string; // image, pdf, audio, other
    created_at: string;
    note_id?: number;
    folder_id?: number;
}

export interface UploadedFile {
    id: number;
    filename: string;
    title?: string;
    type: string;
    filepath: string;
    uploaded_at: string;
}