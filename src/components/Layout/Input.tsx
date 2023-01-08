import { InputHTMLAttributes } from "react";
import classes from "./Input.module.css";

// interfaces
// InputHTMLAttributes<HTMLInputElement> represents all HTML Input Element attributes, other attributes are not authorized
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className: string;
  isVisible: boolean;
  label: string;
  forgotPassword?: JSX.Element;
  onInputDateClick?: () => void;
}

// component
const Input: React.FC<InputProps> = ({
  className,
  isVisible,
  name,
  label,
  forgotPassword,
  onInputDateClick,
  ...input
}) => {
  const handleInputClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLInputElement).type === "date") {
      event.stopPropagation();
      event.preventDefault();
      onInputDateClick && onInputDateClick();
    }
  };

  return (
    <>
      <div>
        {isVisible && (
          <label className={classes.form__label} htmlFor={input.id}>
            {label}
          </label>
        )}
      </div>
      {forgotPassword && forgotPassword}
      <input
        onClick={handleInputClick}
        className={`${classes.form__input} ${classes[className]}`}
        {...input}
      />
    </>
  );
};

export default Input;
