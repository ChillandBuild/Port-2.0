import type { AnchorHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "solid" | "ghost" | "light" | "onDark";
}

export function Button({ variant = "solid", className, children, ...rest }: ButtonProps) {
  const external = typeof rest.href === "string" && rest.href.startsWith("http");
  return (
    <a
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      {...rest}
    >
      {children}
    </a>
  );
}
