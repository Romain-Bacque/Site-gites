import React, { useState } from "react";
import classes from "./style.module.css";
import { InputProps } from "./types";

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
  const [error, setError] = useState<string>("");

  const handleInputClick: React.MouseEventHandler<HTMLInputElement> = (
    event
  ) => {
    if ("type" in event.target && event.target.type === "date") {
      event.stopPropagation();
      event.preventDefault();
      onInputDateClick && onInputDateClick();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // si le champ est requis et vide
    if (input.required && !e.target.value.trim()) {
      setError("Ce champ est requis");
    } else {
      setError("");
    }
  };

  return (
    <>
      {isVisible && (
        <label className={classes.form__label} htmlFor={input.id}>
          {label}
          {input.required && (
            <span
              className={classes.form__required}
              aria-label="champ requis"
              title="Champ requis"
            >
              *
            </span>
          )}
        </label>
      )}

      {forgotPassword && forgotPassword}

      <div className={classes["form__input-container"]}>
        <input
          {...input}
          onClick={handleInputClick}
          onBlur={handleBlur}
          className={`${classes.form__input} ${
            error ? classes["form__input--error"] : ""
          } ${className ? classes[className] : ""}`}
        />
        {icon}
        {error && <p className={classes.form__error}>{error}</p>}
      </div>
    </>
  );
};

export default Input;
