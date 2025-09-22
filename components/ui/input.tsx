"use client";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={"flex h-9 w-full rounded-md border px-3 py-2 text-sm " + className}
      {...props}
    />
  )
);
Input.displayName = "Input";
