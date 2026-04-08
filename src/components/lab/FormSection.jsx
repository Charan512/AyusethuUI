import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Collapsible section with a green header bar — matches the clinical lab spec.
 */
export default function FormSection({ title, number, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Green header bar */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-green-700 hover:bg-green-800 transition-colors text-white"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
            {number}
          </span>
          <span className="font-bold text-sm tracking-wide uppercase">{title}</span>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Content */}
      {open && (
        <div className="bg-white px-6 py-5">
          {children}
        </div>
      )}
    </div>
  );
}
