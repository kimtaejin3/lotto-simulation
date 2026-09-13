import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
const base =
  "btn-press inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-display text-lg leading-none transition-[background-color,box-shadow,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-[0_10px_24px_-10px_var(--accent)] hover:bg-accent-ink",
  secondary: "border border-line bg-paper/70 text-ink hover:bg-accent-tint dark:bg-bg-2 dark:hover:bg-accent-soft",
  ghost: "text-ink-2 hover:bg-accent-tint",
};

export function Button({ variant = "primary", className = "", ...rest }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
