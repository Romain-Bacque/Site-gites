import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "./style.module.css";
import { InputOrTextareaProps } from "./types";

const Input: React.FC<InputOrTextareaProps> = ({
  type = "text",
  icon,
  className,
  isVisible = true,
  name,
  label,
  forgotPassword,
  onInputDateClick,
  ...input
}) => {
  const { t } = useTranslation();
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
    if (input.required && !e.target.value.trim()) {
      setError(t("form.requiredError"));
    } else {
      setError("");
    }
  };

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          {...input}
          className={`${classes.form__input} ${
            error ? classes["form__input--error"] : ""
          } ${className ? classes[className] : ""}`}
        />
      );
    }

    return (
      <input
        {...input}
        type={type}
        onClick={handleInputClick}
        onBlur={handleBlur}
        className={`${classes.form__input} ${
          error ? classes["form__input--error"] : ""
        } ${className ? classes[className] : ""}`}
      />
    );
  };

  return (
    <>
      {isVisible && (
        <label className={classes.form__label} htmlFor={input.id}>
          {label}
          {input.required && (
            <span
              className={classes.form__required}
              aria-label={t("form.requiredAria")}
              title={t("form.requiredTitle")}
            >
              *
            </span>
          )}
        </label>
      )}

      {forgotPassword && forgotPassword}

      <div className={classes["form__input-container"]}>
        {renderInput()}
        {icon}
        {error && <p className={classes.form__error}>{error}</p>}
      </div>
    </>
  );
};

export default Input;
