"use client";

import { useState, useRef, useEffect, useMemo, useCallback, useId } from "react";
import type { SelectFieldProps } from "@/app/utils/types/selectField.types";

export type { SelectOption, SelectFieldProps } from "@/app/utils/types/selectField.types";

export default function SelectField({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  required = false,
  className = "",
  disabled = false,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const handleClose = useCallback((e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);
    document.addEventListener("touchstart", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("touchstart", handleClose);
    };
  }, [handleClose]);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  const handleSelect = useCallback((optValue: string) => {
    onChange(optValue);
    setOpen(false);
  }, [onChange]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && (
        <label id={labelId} className="block text-sm font-semibold mb-1.5 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? labelId : undefined}
        className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${selected ? "text-gray-900" : "text-gray-400"} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg className={`w-4 h-4 ml-2 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-[200] mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between cursor-pointer hover:bg-blue-50 ${opt.value === value ? "font-bold bg-blue-50" : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <svg className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
