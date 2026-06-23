"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-[#192F59] text-sm sm:text-base pr-4">
              {item.q}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-[#E67E22] flex-shrink-0 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              open === i ? "max-h-48" : "max-h-0"
            }`}
          >
            <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
