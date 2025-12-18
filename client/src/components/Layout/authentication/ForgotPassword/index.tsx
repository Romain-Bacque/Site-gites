import React, { useEffect } from "react";
import useInput from "../../../../hooks/use-input";
import useHTTPState from "../../../../hooks/use-http-state";
import { useMyQuery, useMyMutation } from "../../../../hooks/use-query";
import { useTranslation } from "react-i18next";

import Card from "../../../UI/Card";
import Input from "../../Input";
import classes from "../style.module.css";
import { forgotPasswordRequest, getCSRF } from "../../../../lib/api";
// types import
import { UserData } from "./types";

// component
const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();

  // load CSRF on mount
  useMyQuery({
    queryFn: getCSRF,
    queryKey: ["getCSRF"],
  });

  const {
    mutate: forgotPasswordMutate,
    status: forgotPasswordStatus,
    error: forgotPasswordError,
  } = useMyMutation<UserData, any>({
    mutationFn: forgotPasswordRequest,
  });

  const {
    value: userEmailValue,
    isValid: userEmailIsValid,
    isTouched: userEmailIsTouched,
    changeHandler: userEmailChangeHandler,
    blurHandler: userEmailBlurHandler,
    resetHandler: userEmailResetHandler,
  } = useInput();

  const handleHTTPState = useHTTPState();

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!userEmailIsValid) return;

    const userData: UserData = { email: userEmailValue };
    forgotPasswordMutate(userData);
  };

  useEffect(() => {
    const errorMessage =
      (forgotPasswordError as any)?.response?.data?.message ||
      (forgotPasswordError as any)?.message ||
      "";

    handleHTTPState(forgotPasswordStatus, errorMessage);

    if (forgotPasswordStatus === "success") {
      handleHTTPState("success", t("forgotPassword.successMessage"));
      userEmailResetHandler();
    }
  }, [
    forgotPasswordStatus,
    forgotPasswordError,
    handleHTTPState,
    userEmailResetHandler,
    t,
  ]);

  return (
    <Card className={classes.auth}>
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>{t("forgotPassword.title")}</h3>
        <div>
          <Input
            label={t("forgotPassword.emailLabel")}
            isVisible={true}
            className={
              !userEmailIsValid && userEmailIsTouched ? "form__input--red" : ""
            }
            id="user-email"
            onChange={userEmailChangeHandler}
            onBlur={userEmailBlurHandler}
            type="email"
            value={userEmailValue}
            placeholder={t("forgotPassword.emailPlaceholder")}
          />
          <button
            disabled={!userEmailIsValid}
            className={`button ${classes["auth__button"]}`}
          >
            {t("forgotPassword.submitButton")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ForgotPassword;
