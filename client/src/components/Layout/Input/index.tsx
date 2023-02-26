import classes from "./style.module.css";
// types import
import { InputProps } from "./types";

// component
const Input: React.FC<InputProps> = ({
  icon,
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
      {isVisible && (
        <label className={classes.form__label} htmlFor={input.id}>
          {label}
        </label>
      )}
      {forgotPassword && forgotPassword}
      <div className={classes["form__input-container"]}>
        <input
          onClick={handleInputClick}
          className={`${classes.form__input} ${classes[className]}`}
          {...input}
        />
        {icon}
      </div>
    </>
  );
};

export default Input;
