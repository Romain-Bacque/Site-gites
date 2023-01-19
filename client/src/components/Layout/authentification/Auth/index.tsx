import useInput from "../../../../hooks/use-input";
import { Link, useHistory } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import useHttp, { HTTPStateKind } from "../../../../hooks/use-http";
import { useAppDispatch } from "../../../../hooks/use-store";

import Input from "../../Input";
import Card from "../../../UI/Card";
import classes from "../style.module.css";
import { registerRequest, loginRequest } from "../../../../lib/api";
import LoaderAndAlert from "../../LoaderAndAlert";
import { authActions } from "../../../../store/auth";
// types import
import { LoginData } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// component
const Auth: React.FC = () => {
  const {
    sendHttpRequest: loginHttpRequest,
    statut: loginStatut,
    error: loginErrorMessage,
  } = useHttp(loginRequest);
  const {
    sendHttpRequest: registerHttpRequest,
    statut: registerStatut,
    error: registerErrorMessage,
  } = useHttp(registerRequest);
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
  const [loaderAndAlert, setLoaderAndAlert] = useState<JSX.Element | null>(
    null
  );
  const dispatch = useAppDispatch();
  const history = useHistory();

  let isFormValid: boolean;

  if (isNotRegistered) {
    isFormValid = usernameIsValid && userEmailIsValid && userPasswordIsValid;
  } else {
    isFormValid = usernameIsValid && userPasswordIsValid;
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    let userData: LoginData = {
      username: usernameValue,
      password: userPasswordValue,
    };

    if (isNotRegistered) {
      registerHttpRequest({ ...userData, email: userEmailValue });
    } else {
      loginHttpRequest(userData);
    }
  };

  const handleClick = () => {
    setLoaderAndAlert(null);
    usernameResetHandler();
    userEmailResetHandler();
    userPasswordResetHandler();
    setIsNotRegistered(!isNotRegistered);
  };

  const handleServerResponse = useCallback(
    (statut: HTTPStateKind) => {
      if (statut === HTTPStateKind.SUCCESS) {
        if (isNotRegistered) {
          usernameResetHandler();
          userEmailResetHandler();
          userPasswordResetHandler();
        } else {
          dispatch(authActions.login());
          history.replace("/");
        }
      }
    },
    [dispatch, history]
  );

  // login
  useEffect(() => {
    loginStatut &&
      setLoaderAndAlert(
        <LoaderAndAlert
          statut={loginStatut}
          onServerResponse={handleServerResponse}
          message={{
            success: null,
            error: loginErrorMessage,
          }}
        />
      );
  }, [loginStatut, handleServerResponse]);

  // register
  useEffect(() => {
    registerStatut &&
      setLoaderAndAlert(
        <LoaderAndAlert
          statut={registerStatut}
          message={{
            success: "Enregistrement réussi.",
            error: registerErrorMessage,
          }}
        />
      );
  }, [registerStatut]);

  return (
    <>
      {loaderAndAlert}
      <Card className={classes.auth}>
        <form onSubmit={submitHandler} className={classes["auth__form"]}>
          <h3 className={classes["auth__title"]}>
            {isNotRegistered ? "Enregistrement" : "Connexion"}
          </h3>
          <div>
            <Input
              label="Pseudo"
              isVisible={true}
              className={
                !usernameIsValid && usernameIsTouched ? "form__input--red" : ""
              }
              id="user-name"
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
              type="texte"
              value={usernameValue}
              placeholder="Taper le pseudo ici"
            />
            {isNotRegistered && (
              <Input
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
                  to="/admin/forgot-password"
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
            <button disabled={!isFormValid} className={classes["auth__button"]}>
              Se connecter
            </button>
          </div>
          <div>
            <span className={classes["auth__span"]}>
              {!isNotRegistered
                ? "Vous n'avez pas de compte ?"
                : "Vous avez un compte ?"}
            </span>
            <a onClick={handleClick} className={classes["auth__link"]}>
              {!isNotRegistered ? "S'enregistrer." : "Se connecter."}
            </a>
          </div>
        </form>
      </Card>
    </>
  );
};

export default Auth;
