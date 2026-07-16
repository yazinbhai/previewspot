"use client";

import { useLenis } from 'lenis/react';

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    href?: string;
    children: React.ReactNode;
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    children,
    ...props
}: ButtonProps) {
    const lenis = useLenis();

    const baseStyles = "relative inline-flex items-center justify-center font-bold font-cinematic uppercase tracking-wider overflow-hidden rounded-full transition-all duration-300 group";

    const variants = {
        primary: "bg-white text-black hover:bg-gray-200",
        secondary: "bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]",
        outline: "border border-white/20 hover:border-white/50 bg-black/50 backdrop-blur-sm text-white",
    };

    const sizes = {
        sm: "px-6 py-3 text-sm",
        md: "px-8 py-4 text-base",
        lg: "px-10 py-5 text-lg",
    };

    const innerContent = (
        <>
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {/* Shine effect for primary/secondary */}
            {variant !== "outline" && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            )}
        </>
    );

    if (props.href) {
        return (
            <a
                href={props.href}
                onClick={(e) => {
                    e.preventDefault();
                    if (lenis && props.href) {
                        lenis.scrollTo(props.href);
                    }
                }}
                className={cn(baseStyles, "hover:scale-105 active:scale-95", variants[variant], sizes[size], className)}
            >
                {innerContent}
            </a>
        );
    }

    return (
        <button
            className={cn(baseStyles, "hover:scale-105 active:scale-95", variants[variant], sizes[size], className)}
            {...(props as any)}
        >
            {innerContent}
        </button>
    );
}
