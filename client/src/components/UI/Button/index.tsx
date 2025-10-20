import { FC, ButtonHTMLAttributes } from "react";
import clsx from "clsx"; // clsx is a tiny utility for constructing className strings conditionally
import styles from "./style.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  type = "button",
  fullWidth = false,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      type={type}
      style={{ width: fullWidth ? "100%" : "auto" }}
      className={clsx(
        styles.button,
        styles[variant!],
        styles[size!],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className={clsx(
            styles.spinner,
            size === "sm" && styles.spinnerSm,
            size === "md" && styles.spinnerMd,
            size === "lg" && styles.spinnerLg,
            size === "xl" && styles.spinnerLg
          )}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className={styles.spinnerCircle}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.25"
          />
          <path
            className={styles.spinnerPath}
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" // d is a SVG path data attribute, means "draw a line from point to point" in this case (see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d)
            opacity="0.75"
          />
        </svg>
      )}
      {Icon && iconPosition === "left" && (
        <Icon className={clsx(styles.iconLeft, loading && styles.iconHidden)} />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon
          className={clsx(styles.iconRight, loading && styles.iconHidden)}
        />
      )}
    </button>
  );
};

export default Button;
