"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export function Select({ className, options, value, onChange, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
        className
      )}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}



