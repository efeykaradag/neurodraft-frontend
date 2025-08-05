import { motion } from "framer-motion";
import React from "react";

interface AIBoxProps {
    title: string;
    desc: string;
    color: string;
    icon: React.ReactNode;
    cta: string;
    badge?: string;
}

export default function AIBox({ title, desc, color, icon, cta, badge }: AIBoxProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.025, y: -2, boxShadow: "0 8px 32px 0 #00fff099" }}
            className={`relative group bg-[#232338] p-4 rounded-2xl shadow flex items-center gap-3 transition border-l-4 ${color ? "border-gradient-l "+color : "border-[#8B5CF6]"}`}
            style={{ borderImage: color ? `linear-gradient(to bottom, var(--tw-gradient-stops)) 1` : undefined }}
        >
            <div className="shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="font-bold mb-0.5 flex items-center gap-2">
                    {title}
                    {badge && (
                        <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${badge === "beta" ? "bg-yellow-400/30 text-yellow-400" : "bg-[#232338] border border-[#00fff0] text-[#00fff0]"}`}>
                            {badge === "beta" ? "BETA" : badge.toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="text-xs text-gray-400">{desc}</div>
            </div>
            <button
                className={`ml-2 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r ${color} text-white shadow hover:scale-105 transition`}
                tabIndex={-1}
                type="button"
            >{cta}</button>
        </motion.div>
    );
}
