import { InputHTMLAttributes, ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export default function FormInput({
  label,
  error,
  helperText,
  icon,
  fullWidth = true,
  ...props
}: FormInputProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}
        <input
          {...props}
          className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#192F59] focus:ring-offset-0 ${
            icon ? "pl-10" : ""
          } ${
            error
              ? "border-red-300 bg-red-50 focus:ring-red-500"
              : "border-gray-300 bg-white focus:border-[#192F59]"
          } ${props.className}`}
        />
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
    </div>
  );
}
