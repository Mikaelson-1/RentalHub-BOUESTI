import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  shadow?: "sm" | "md" | "lg" | "none";
  border?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  shadow = "sm",
  border = true,
  hover = false,
}: CardProps) {
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <div
      className={`bg-white rounded-xl ${shadowClasses[shadow]} ${
        border ? "border border-gray-100" : ""
      } ${hover ? "hover:shadow-md transition-shadow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
