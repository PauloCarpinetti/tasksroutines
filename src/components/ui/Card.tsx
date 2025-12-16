"use client";

import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, title, className = "" }: CardProps) {
  return (
    <div
      className={`bg-(--md-sys-color-surface-container) p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-extrabold text-(--md-sys-color-primary) mb-6 border-b border-(--md-sys-color-outline-variant) pb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
