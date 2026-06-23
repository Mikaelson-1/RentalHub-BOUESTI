import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "gray";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

export default function Badge({
  children,
  variant = "gray",
  size = "md",
  icon,
}: BadgeProps) {
  const variantClasses = {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-indigo-100 text-indigo-800",
    gray: "bg-gray-100 text-gray-700",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {icon}
      {children}
    </span>
  );
}
