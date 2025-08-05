import React from "react";


export default function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative bg-[#232338] rounded-2xl shadow-2xl p-7 min-w-[340px] max-w-xl w-full mx-2">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-white/60 hover:text-white"
                >×</button>
                {children}
            </div>
        </div>
    );
}