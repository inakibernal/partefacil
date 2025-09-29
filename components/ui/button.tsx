"use client";
import * as React from "react";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={"inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium " + className}
      {...props}
    />
  )
);
Button.displayName = "Button";
