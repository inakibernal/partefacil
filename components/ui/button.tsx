"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "lg" | "md" | "sm";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-black text-white hover:bg-black/90 ring-black",
      outline:
        "border border-black/10 bg-white text-black hover:bg-black/5 ring-black",
      ghost: "bg-transparent hover:bg-black/5 text-black ring-black",
    };
    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      lg: "h-12 px-6 text-base",
      md: "h-10 px-5 text-sm",
      sm: "h-9 px-4 text-sm",
    };

    return (
      <Comp
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";



