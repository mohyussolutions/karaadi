"use client";

import React, { useState, ChangeEvent } from "react";
import { FiEye, FiEyeOff } from "@/app/utils/icons";

interface PasswordToggleProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({
  value,
  onChange,
  id = "password",
  name,
  autoComplete,
  placeholder,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: e.target.value.trimStart() },
    } as ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={handleChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className={`pr-10 text-gray-900 placeholder:text-gray-400 ${className}`}
      />
      <span
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
        role="button"
        tabIndex={0}
        aria-label={visible ? "Hide password" : "Show password"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setVisible((v) => !v);
          }
        }}
      >
        {visible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </span>
    </div>
  );
};

export default PasswordToggle;
