"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useInput from "../../../../hooks/use-input";
import { useMyQuery, useMyMutation } from "../../../../hooks/use-query";
import { useLocale, useTranslations } from "next-intl";

import Card from "../../../UI/Card";
import Input from "../../Input";
import classes from "../style.module.css";
import { getCSRF, updatePasswordRequest } from "../../../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useHTTPState from "../../../../hooks/use-http-state";
import { useAppSelector } from "../../../../hooks/use-store";

const Profile: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [isCurrentPasswordMasked, setIsCurrentPasswordMasked] = useState(true);
  const [isNewPasswordMasked, setIsNewPasswordMasked] = useState(true);
  const handleHTTPState = useHTTPState();
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuth) {
      router.replace(`/${locale}/login`);
    }
  }, [isAuth, router, locale]);

  // Fetch CSRF token on mount
  useMyQuery({
    queryKey: ["getCSRF"],
    queryFn: getCSRF,
  });

  // Current password input
  const {
    value: currentPasswordValue,
    isValid: currentPasswordIsValid,
    isTouched: currentPasswordIsTouched,
    changeHandler: currentPasswordChangeHandler,
    blurHandler: currentPasswordBlurHandler,
    resetHandler: currentPasswordResetHandler,
    passwordState: currentPasswordState,
  } = useInput();

  // New password input
  const {
    value: newPasswordValue,
    isValid: newPasswordIsValid,
    isTouched: newPasswordIsTouched,
    changeHandler: newPasswordChangeHandler,
    blurHandler: newPasswordBlurHandler,
    resetHandler: newPasswordResetHandler,
    passwordState: newPasswordState,
  } = useInput();

  const { mutate: updatePasswordMutate, status: updatePasswordStatus } =
    useMyMutation({
      mutationFn: updatePasswordRequest,
      onErrorFn: (_err, errorMessage) => {
        handleHTTPState("error", errorMessage || t("profile.error"));
      },
      onSuccessFn: () => {
        handleHTTPState("success", t("profile.success"));
        currentPasswordResetHandler();
        newPasswordResetHandler();
      },
    });

  useEffect(() => {
    if (updatePasswordStatus === "pending") {
      handleHTTPState("pending");
    }
  }, [updatePasswordStatus, handleHTTPState]);

  const isFormValid = currentPasswordIsValid && newPasswordIsValid;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    updatePasswordMutate({
      actualPassword: currentPasswordValue,
      newPassword: newPasswordValue,
    });
  };

  // Don't render if not authenticated
  if (!isAuth) {
    return null;
  }

  return (
    <Card className={classes.auth}>
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>{t("profile.title")}</h3>
        <div>
          {/* Current Password */}
          <Input
            icon={
              <FontAwesomeIcon
                className={classes.form__icon}
                onClick={() => setIsCurrentPasswordMasked((prev) => !prev)}
                icon={isCurrentPasswordMasked ? faEyeSlash : faEye}
              />
            }
            label={t("profile.currentPasswordLabel")}
            isVisible={true}
            className={
              !currentPasswordIsValid && currentPasswordIsTouched
                ? "form__input--red"
                : ""
            }
            maxLength={32}
            id="current-password"
            onChange={currentPasswordChangeHandler}
            onBlur={currentPasswordBlurHandler}
            type={isCurrentPasswordMasked ? "password" : "text"}
            value={currentPasswordValue}
            placeholder={t("profile.currentPasswordPlaceholder")}
          />
          {currentPasswordState.length > 0 && (
            <ul className={classes["auth__password-error-list"]}>
              <span>{t("profile.passwordRequirements")}</span>
              {currentPasswordState.map((item) => (
                <li key={item.toString()}>{item}</li>
              ))}
            </ul>
          )}

          {/* New Password */}
          <Input
            icon={
              <FontAwesomeIcon
                className={classes.form__icon}
                onClick={() => setIsNewPasswordMasked((prev) => !prev)}
                icon={isNewPasswordMasked ? faEyeSlash : faEye}
              />
            }
            label={t("profile.newPasswordLabel")}
            isVisible={true}
            className={
              !newPasswordIsValid && newPasswordIsTouched
                ? "form__input--red"
                : ""
            }
            maxLength={32}
            id="new-password"
            onChange={newPasswordChangeHandler}
            onBlur={newPasswordBlurHandler}
            type={isNewPasswordMasked ? "password" : "text"}
            value={newPasswordValue}
            placeholder={t("profile.newPasswordPlaceholder")}
          />
          {newPasswordState.length > 0 && (
            <ul className={classes["auth__password-error-list"]}>
              <span>{t("profile.passwordRequirements")}</span>
              {newPasswordState.map((item) => (
                <li key={item.toString()}>{item}</li>
              ))}
            </ul>
          )}

          <button
            disabled={!isFormValid}
            className={`button ${classes["auth__button"]}`}
          >
            {t("common.save")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default Profile;
