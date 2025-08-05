// components/ui/AIResultPanel.tsx
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIResultPanel({ open, onClose, title, content }: {
    open: boolean,
    onClose: () => void,
    title: string,
    content: string | null
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 60 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="fixed bottom-7 right-7 z-50 max-w-md w-full bg-gradient-to-br from-[#191b24] to-[#2d3756] shadow-2xl rounded-2xl border border-[#06B6D4] flex flex-col p-0"
                >
                    <div className="flex items-center justify-between px-6 py-3 border-b border-[#232338]">
                        <span className="font-bold text-lg bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">{title}</span>
                        <button
                            className="text-gray-300 hover:text-cyan-400 transition"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto text-[15px] text-gray-100 max-h-96 whitespace-pre-line font-mono">
                        {content}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
