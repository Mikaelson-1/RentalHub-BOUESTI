import { ReactNode } from "react";
import Card from "./Card";

interface StatBoxProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  color?: "green" | "blue" | "orange" | "red";
}

const colorClasses = {
  green: "text-[#00A553]",
  blue: "text-[#192F59]",
  orange: "text-[#E67E22]",
  red: "text-red-600",
};

export default function StatBox({ value, label, icon, color = "green" }: StatBoxProps) {
  return (
    <Card shadow="sm" border>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`text-3xl font-bold ${colorClasses[color]} mb-2`}>{value}</div>
          <div className="text-gray-600 text-sm">{label}</div>
        </div>
        {icon && <div className="text-gray-300">{icon}</div>}
      </div>
    </Card>
  );
}
