import { ReactNode } from "react";
import { X } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

const typeClasses = {
  success: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
    icon: "text-green-600",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    icon: "text-red-600",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    icon: "text-amber-600",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-600",
  },
};

export default function Alert({ type, title, message, icon, action, onClose }: AlertProps) {
  const c = typeClasses[type];

  return (
    <div className={`flex items-start justify-between gap-4 border rounded-xl px-5 py-4 ${c.bg}`}>
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className={`flex-shrink-0 ${c.icon}`}>{icon}</div>}
        <div className="flex-1">
          <p className={`text-sm font-medium ${c.text}`}>{title}</p>
          {message && <p className={`text-sm mt-1 ${c.text} opacity-90`}>{message}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {action && (
          <button
            onClick={action.onClick}
            className={`text-xs font-semibold bg-white border border-current px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors ${c.text}`}
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className={`${c.icon} hover:opacity-70 transition-opacity`}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
