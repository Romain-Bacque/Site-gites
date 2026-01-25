/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useInput from "../../../../hooks/use-input";
import React, { useEffect, useState } from "react";
import { useMyQuery, useMyMutation } from "../../../../hooks/use-query";
import { useAppDispatch } from "../../../../hooks/use-store";
import { useLocale, useTranslations } from "next-intl";
import Input from "../../Input";
import Card from "../../../UI/Card";
import classes from "../style.module.css";
import { registerRequest, loginRequest, getCSRF } from "../../../../lib/api";
import { authActions } from "../../../../store/auth";
import { LoginData } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useHTTPState from "../../../../hooks/use-http-state";
import useRecaptcha from "../../../../hooks/use-recaptcha";
import Captcha from "../Captcha";
import Button from "../../../UI/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Auth: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const captchaRef = React.useRef<any>(null);
  const { setCaptchaValue, captchaValue, verifyCaptcha } = useRecaptcha();
  const dispatch = useAppDispatch();
  const handleHTTPState = useHTTPState();

  useMyQuery({
    queryKey: ["csrf"],
    queryFn: () => getCSRF(),
  });

  const { mutate: loginMutate, status: loginStatus } = useMyMutation<
    LoginData,
    any
  >({
    mutationFn: (data) => loginRequest(data),
    onErrorFn: (_, errMessage) => {
      handleHTTPState("error", errMessage || t("auth.loginError"));
    },
    onSuccessFn: (data) => {
      handleHTTPState("success", t("auth.welcomeMessage", { username: data.username }));
      dispatch(authActions.login());
      router.replace(`/${locale}/`);
    },
  });

  const { mutate: registerMutate, status: registerStatus } = useMyMutation<
    { email: string } & LoginData,
    any
  >({
    mutationFn: (data) => registerRequest(data),
    onErrorFn: (_, errMessage) => {
      handleHTTPState("error", errMessage ?? t("auth.registerError"));
    },
    onSuccessFn: () => {
      handleHTTPState("success", t("auth.registerSuccess"));
    },
  });

  const {
    value: usernameValue,
    isValid: usernameIsValid,
    isTouched: usernameIsTouched,
    changeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
    resetHandler: usernameResetHandler,
  } = useInput();
  const {
    value: userEmailValue,
    isValid: userEmailIsValid,
    isTouched: userEmailIsTouched,
    changeHandler: userEmailChangeHandler,
    blurHandler: userEmailBlurHandler,
    resetHandler: userEmailResetHandler,
  } = useInput();
  const {
    value: userPasswordValue,
    isValid: userPasswordIsValid,
    isTouched: userPasswordIsTouched,
    changeHandler: userPasswordChangeHandler,
    blurHandler: userPasswordBlurHandler,
    resetHandler: userPasswordResetHandler,
    passwordState: userPasswordState,
  } = useInput();

  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const [isNotRegistered, setIsNotRegistered] = useState(false);

  const isFormValid = isNotRegistered
    ? usernameIsValid && userEmailIsValid && userPasswordIsValid
    : usernameIsValid && userPasswordIsValid;

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    handleHTTPState("pending");

    const isCaptchaValid = await verifyCaptcha();
    if (!isCaptchaValid) {
      handleHTTPState("error", t("auth.captchaError"));
      return;
    }

    const userData: LoginData = {
      username: usernameValue,
      password: userPasswordValue,
    };

    if (isNotRegistered) {
      registerMutate({ ...userData, email: userEmailValue });
    } else {
      loginMutate(userData);
    }
  };

  const handleClick = () => {
    usernameResetHandler();
    userEmailResetHandler();
    userPasswordResetHandler();
    setIsNotRegistered(!isNotRegistered);
  };

  useEffect(() => {
    if (
      (loginStatus === "error" || registerStatus === "error") &&
      captchaRef.current
    ) {
      captchaRef.current.reset();
      setCaptchaValue(null);
    }
  }, [loginStatus, registerStatus, setCaptchaValue]);

  return (
    <Card className={classes.auth}>
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>
          {isNotRegistered ? t("auth.register") : t("auth.login")}
        </h3>
        <div>
          <Input
            tabIndex={1}
            label={t("auth.username")}
            isVisible={true}
            className={
              !usernameIsValid && usernameIsTouched ? "form__input--red" : ""
            }
            id="user-name"
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
            type="text"
            value={usernameValue}
            placeholder={t("auth.usernamePlaceholder")}
          />
          {isNotRegistered && (
            <Input
              tabIndex={1}
              label={t("auth.email")}
              isVisible={true}
              className={
                !userEmailIsValid && userEmailIsTouched
                  ? "form__input--red"
                  : ""
              }
              id="user-email"
              onChange={userEmailChangeHandler}
              onBlur={userEmailBlurHandler}
              type="email"
              value={userEmailValue}
              placeholder={t("auth.emailPlaceholder")}
            />
          )}
          <Input
            tabIndex={2}
            icon={
              <FontAwesomeIcon
                onClick={() => setIsPasswordMasked((prev) => !prev)}
                icon={isPasswordMasked ? faEyeSlash : faEye}
              />
            }
            label={t("auth.password")}
            forgotPassword={
              <Link
                href={`/${locale}/forgot-password`}
                className={classes["auth__link"]}
              >
                {!isNotRegistered && t("auth.forgotPassword")}
              </Link>
            }
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
            placeholder={t("auth.passwordPlaceholder")}
          />
          {userPasswordState.length > 0 && (
            <ul className={classes["auth__password-error-list"]}>
              <span>{t("auth.passwordRequirements")}</span>
              {userPasswordState.map((item) => (
                <li key={item.toString()}>{item}</li>
              ))}
            </ul>
          )}
          <Button
            fullWidth
            size="xl"
            disabled={!isFormValid || !captchaValue}
            loading={loginStatus === "pending" || registerStatus === "pending"}
            type="submit"
            className={`button ${classes["auth__button"]}`}
          >
            {isNotRegistered ? t("auth.registerAction") : t("auth.loginAction")}
          </Button>
        </div>
        <div>
          <span className={classes["auth__span"]}>
            {!isNotRegistered ? t("auth.noAccount") : t("auth.haveAccount")}
          </span>
          <a onClick={handleClick} className={classes["auth__link"]}>
            {!isNotRegistered
              ? t("auth.registerAction")
              : t("auth.loginAction")}
          </a>
        </div>
        <Captcha onChange={setCaptchaValue} ref={captchaRef} />
      </form>
    </Card>
  );
};

export default Auth;
