import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses = {
  primary: "bg-[#192F59] text-white hover:bg-[#1a3570] disabled:bg-gray-400",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
  ghost: "bg-transparent text-[#192F59] hover:bg-blue-50 disabled:text-gray-400",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  loading,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {children}
    </button>
  );
}
