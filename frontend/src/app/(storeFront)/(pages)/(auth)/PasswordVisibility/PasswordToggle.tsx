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
  label?: string;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({
  value,
  onChange,
  id = "password",
  name,
  autoComplete,
  placeholder,
  className = "",
  label = "Password",
}) => {
  const [visible, setVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trimStart();
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: trimmedValue,
      },
    } as ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };
  const toggleOnEnterOrSpace = (
    e: React.KeyboardEvent,
    toggleFunc: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFunc((v) => !v);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      ></label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${className}`}
        />
        <span
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
          role="button"
          tabIndex={0}
          aria-label={visible ? "Hide password" : "Show password"}
          onKeyDown={(e) => toggleOnEnterOrSpace(e, setVisible)}
        >
          {visible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </span>
      </div>
    </div>
  );
};

export default PasswordToggle;
