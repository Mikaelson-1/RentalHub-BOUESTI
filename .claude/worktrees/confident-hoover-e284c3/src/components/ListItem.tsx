import { ReactNode } from "react";

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: ReactNode;
  actions?: ReactNode;
  badge?: {
    label: string;
    variant: "success" | "pending" | "rejected";
  };
}

const badgeClasses = {
  success: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ListItem({
  title,
  subtitle,
  description,
  thumbnail,
  actions,
  badge,
}: ListItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="flex gap-3 flex-1">
        {thumbnail && <div className="flex-shrink-0">{thumbnail}</div>}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {subtitle && <p className="text-gray-600 text-sm truncate">{subtitle}</p>}
          {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
          {badge && (
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${badgeClasses[badge.variant]}`}>
              {badge.label}
            </span>
          )}
        </div>
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}
