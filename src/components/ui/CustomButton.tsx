// components/ui/CustomButton.tsx
import React from "react";

interface CustomButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    variant?: "primary" | "secondary";
}

export default function CustomButton({
                                         onClick,
                                         children,
                                         type = "button",
                                         className = "",
                                         disabled = false,
                                     }: CustomButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={
                "bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold py-2 px-4 rounded-lg shadow transition hover:scale-105 w-full " +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
