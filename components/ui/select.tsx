"use client";
import * as React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { items?: {value:string; label:string}[] };

export function Select(props: SelectProps) {
  const { className = "", items = [], children, ...rest } = props;
  return (
    <select className={"rounded-md border px-3 py-2 text-sm " + className} {...rest}>
      {children ? children : items.map(it => <option key={it.value} value={it.value}>{it.label}</option>)}
    </select>
  );
}

// Stubs compatibles con los imports existentes
export function SelectTrigger({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}
export function SelectContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}
export function SelectItem({ children, value }: { children: React.ReactNode; value: string }) {
  return <option value={value}>{children}</option>;
}
export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <>{placeholder}</>;
}
