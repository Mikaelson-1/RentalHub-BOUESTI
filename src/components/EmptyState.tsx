import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="flex justify-center mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#192F59] text-white px-6 py-2 rounded-lg hover:bg-[#1a3570] transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
