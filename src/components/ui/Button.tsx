"use client";

import React, { ReactNode } from "react";

// Define as propriedades aceitas pelo componente Button
interface ButtonProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "danger" | "outline" | "text";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyle =
    "px-4 py-2 rounded-xl font-semibold transition duration-200 shadow-md flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-[var(--md-sys-color-primary)] hover:opacity-90 text-[var(--md-sys-color-on-primary)]",
    secondary:
      "bg-[var(--md-sys-color-secondary)] hover:opacity-90 text-[var(--md-sys-color-on-secondary)]",
    danger:
      "bg-[var(--md-sys-color-error)] hover:opacity-80 text-[var(--md-sys-color-on-error)]",
    outline:
      "border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] hover:opacity-80",
    text: "text-[var(--md-sys-color-primary)] hover:opacity-80",
  };

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
}
