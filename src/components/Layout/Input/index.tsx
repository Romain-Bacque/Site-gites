import classes from "./style.module.css";
// types import
import { InputProps } from "./types";

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
  const handleInputClick: React.MouseEventHandler<HTMLInputElement> = (
    event
  ) => {
    if ("type" in event.target && event.target.type === "date") {
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
