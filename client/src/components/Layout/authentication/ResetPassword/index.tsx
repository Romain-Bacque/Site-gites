import React, { useEffect, useState } from "react";
import useInput from "../../../../hooks/use-input";
import { useMyQuery, useMyMutation } from "../../../../hooks/use-query";
import { useTranslation } from "react-i18next";

import Card from "../../../UI/Card";
import Input from "../../Input";
import classes from "../style.module.css";
import { getCSRF, resetPasswordRequest } from "../../../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useHTTPState from "../../../../hooks/use-http-state";

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id") || "";
  const token = queryParams.get("token") || "";
  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const handleHTTPState = useHTTPState();

  // fetch CSRF token on mount
  useMyQuery({
    queryKey: ["getCSRF"],
    queryFn: getCSRF,
  });

  const {
    value: userPasswordValue,
    isValid: userPasswordIsValid,
    isTouched: userPasswordIsTouched,
    changeHandler: userPasswordChangeHandler,
    blurHandler: userPasswordBlurHandler,
    resetHandler: userPasswordResetHandler,
    passwordState: userPasswordState,
  } = useInput();

  const { mutate: resetPasswordMutate, status: resetPasswordStatus } =
    useMyMutation({
      mutationFn: resetPasswordRequest,
      onErrorFn: (_err, errorMessage) => {
        handleHTTPState("error", errorMessage || t("resetPassword.error"));
      },
      onSuccessFn: () => {
        handleHTTPState("success", t("resetPassword.success"));
        userPasswordResetHandler();
      },
    });

  useEffect(() => {
    if (resetPasswordStatus === "pending") {
      handleHTTPState("pending");
    }
  }, [resetPasswordStatus, handleHTTPState]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userPasswordIsValid) return;

    if (!id || !token) {
      handleHTTPState("error", t("resetPassword.invalidLink"));
      return;
    }

    const userPassword = { id, token, password: userPasswordValue };
    resetPasswordMutate(userPassword);
  };

  return (
    <Card className={classes.auth}>
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>{t("resetPassword.title")}</h3>
        <div>
          <Input
            icon={
              <FontAwesomeIcon
                className={classes.form__icon}
                onClick={() => setIsPasswordMasked((prev) => !prev)}
                icon={isPasswordMasked ? faEyeSlash : faEye}
              />
            }
            label={t("resetPassword.passwordLabel")}
            isVisible={true}
            className={
              !userPasswordIsValid && userPasswordIsTouched
                ? "form__input--red"
                : ""
            }
            maxLength={32}
            id="user-password"
            onChange={userPasswordChangeHandler}
            onBlur={userPasswordBlurHandler}
            type={isPasswordMasked ? "password" : "text"}
            value={userPasswordValue}
            placeholder={t("resetPassword.passwordPlaceholder")}
          />
          {userPasswordState.length > 0 && (
            <ul className={classes["auth__password-error-list"]}>
              <span>{t("resetPassword.passwordRequirements")}</span>
              {userPasswordState.map((item) => (
                <li key={item.toString()}>{item}</li>
              ))}
            </ul>
          )}
          <button
            disabled={!userPasswordIsValid}
            className={`button ${classes["auth__button"]}`}
          >
            {t("common.save")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ResetPassword;
