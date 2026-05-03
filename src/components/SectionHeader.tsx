interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>
      {action && (
        <a
          href={action.href}
          onClick={action.onClick}
          className="flex-shrink-0 text-[#E67E22] hover:text-[#D35400] font-semibold text-sm transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
