import { InputHTMLAttributes } from "react";

// interfaces
// InputHTMLAttributes<HTMLInputElement> represents all HTML Input Element attributes, other attributes are not authorized
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: JSX.Element;
  className: string;
  isVisible: boolean;
  label: string;
  forgotPassword?: JSX.Element;
  onInputDateClick?: () => void;
}
