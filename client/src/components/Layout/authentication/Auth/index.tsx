import useInput from "../../../../hooks/use-input";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useMyQuery, useMyMutation } from "../../../../hooks/use-query"; // adjust path
import { useAppDispatch } from "../../../../hooks/use-store";

import Input from "../../Input";
import Card from "../../../UI/Card";
import classes from "../style.module.css";
import { registerRequest, loginRequest, getCSRF } from "../../../../lib/api";
import { authActions } from "../../../../store/auth";
// types import
import { LoginData } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useHTTPState from "../../../../hooks/use-http-state";
import useRecaptcha from "../../../../hooks/use-recaptcha";
import Captcha from "../Captcha";
import Button from "../../../UI/Button";

// component
const Auth: React.FC = () => {
  const captchaRef = React.useRef<any>(null);
  const { setCaptchaValue, captchaValue, verifyCaptcha } = useRecaptcha();

  const dispatch = useAppDispatch();
  const handleHTTPState = useHTTPState();
  const history = useHistory();

  // CSRF query (fire-and-forget)
  useMyQuery({
    queryKey: ["csrf"],
    queryFn: () => getCSRF(),
  });

  // login mutation
  const {
    mutate: loginMutate,
    status: loginStatus,
  } = useMyMutation<LoginData, any>({
    mutationFn: (data) => loginRequest(data),
    onErrorFn: (_, errMessage) => {
      handleHTTPState(
        "error",
        errMessage || "Le nom d'utilisateur ou le mot de passe est incorrect."
      );
    },
    onSuccessFn: () => {
      handleHTTPState("success");
      dispatch(authActions.login());
      history.replace("/");
    },
  });

  // register mutation
  const {
    mutate: registerMutate,
    status: registerStatus,
  } = useMyMutation<{ email: string } & LoginData, any>({
    mutationFn: (data) => registerRequest(data),
    onErrorFn: (_, errMessage) => {
      handleHTTPState(
        "error",
        errMessage ?? "Une erreur est survenue lors de l'inscription."
      );
    },
    onSuccessFn: () => {
      handleHTTPState(
        "success",
        "Inscription réussie ! Veuillez vérifier votre boîte mail pour activer votre compte."
      );
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

  let isFormValid: boolean;

  if (isNotRegistered) {
    isFormValid = usernameIsValid && userEmailIsValid && userPasswordIsValid;
  } else {
    isFormValid = usernameIsValid && userPasswordIsValid;
  }

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    handleHTTPState("pending");

    const isCaptchaValid = await verifyCaptcha();

    if (!isCaptchaValid) {
      handleHTTPState(
        "error",
        "Un problème est survenu lors de la vérification du captcha."
      );
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

  // reset captcha if login or register failed
  useEffect(() => {
    const shouldResetCaptcha =
      (loginStatus === "error" || registerStatus === "error") &&
      captchaRef.current;

    if (shouldResetCaptcha) {
      captchaRef.current.reset();
      setCaptchaValue(null);
    }
  }, [loginStatus, registerStatus, setCaptchaValue]);

  return (
    <Card className={classes.auth}>
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>
          {isNotRegistered ? "Enregistrement" : "Connexion"}
        </h3>
        <div>
          <Input
            tabIndex={1}
            label="Pseudo"
            isVisible={true}
            className={
              !usernameIsValid && usernameIsTouched ? "form__input--red" : ""
            }
            id="user-name"
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
            type="text"
            value={usernameValue}
            placeholder="Taper le pseudo ici"
          />
          {isNotRegistered && (
            <Input
              tabIndex={1}
              label="Email"
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
              placeholder="Taper l'adresse email ici"
            />
          )}
          <Input
            tabIndex={2}
            icon={
              <FontAwesomeIcon
                className={classes.form__icon}
                onClick={() => setIsPasswordMasked((prevState) => !prevState)}
                icon={isPasswordMasked ? faEyeSlash : faEye}
              />
            }
            label="Mot de passe"
            forgotPassword={
              <Link
                to="/auth/forgot-password"
                className={classes["auth__link"]}
              >
                {!isNotRegistered && "Oublié ?"}
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
            placeholder="Taper le mot de passe ici"
          />
          {userPasswordState.length > 0 && (
            <ul className={classes["auth__password-error-list"]}>
              <span>Le mot de passe doit comporter :</span>
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
            {isNotRegistered ? "S'enregistrer" : "Se connecter"}
          </Button>
        </div>
        <div>
          <span className={classes["auth__span"]}>
            {!isNotRegistered
              ? "Vous n'avez pas de compte ?"
              : "Vous avez un compte ?"}
          </span>
          {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={handleClick} className={classes["auth__link"]}>
            {!isNotRegistered ? "S'enregistrer." : "Se connecter."}
          </a>
        </div>
        <Captcha onChange={setCaptchaValue} ref={captchaRef} />
      </form>
    </Card>
  );
};

export default Auth;
