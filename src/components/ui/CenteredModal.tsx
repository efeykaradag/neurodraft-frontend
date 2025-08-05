// components/ui/CenteredModal.tsx
import React from "react";

export default function CenteredModal({
                                          children,
                                          onClose,
                                          maxWidth = "max-w-md"
                                      }: {
    children: React.ReactNode,
    onClose: () => void,
    maxWidth?: string
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`relative bg-[#232338] rounded-2xl shadow-2xl p-6 sm:p-8 w-[90vw] ${maxWidth}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-white/70 hover:text-white"
                    aria-label="Kapat"
                >×</button>
                {children}
            </div>
        </div>
    );
}
