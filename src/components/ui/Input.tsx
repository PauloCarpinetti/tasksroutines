"use client";

// Define as propriedades aceitas pelo componente Input
interface InputProps {
  label: string;
  id: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function Input({
  label,
  id,
  type = "text",
  value,
  name,
  onChange,
  placeholder,
  required = false,
  className = "",
}: InputProps) {
  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-(--md-sys-color-on-surface-variant) mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-(--md-sys-color-outline) rounded-xl focus:ring-(--md-sys-color-primary) focus:border-(--md-sys-color-primary) transition duration-150 shadow-sm bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface) placeholder:text-(--md-sys-color-on-surface-variant)"
      />
    </div>
  );
}
