import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

// interfaces
// InputHTMLAttributes<HTMLInputElement> represents all HTML Input Element attributes, other attributes are not authorized
export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  icon?: JSX.Element;
  className: string;
  isVisible?: boolean;
  forgotPassword?: JSX.Element;
  onInputDateClick?: () => void;
}

export type InputOrTextareaProps =
  | (InputProps &
      InputHTMLAttributes<HTMLInputElement> & {
        type?: "text" | "email" | "password" | "date" | "tel" | "number";
      })
  | (InputProps &
      TextareaHTMLAttributes<HTMLTextAreaElement> & { type: "textarea" });
