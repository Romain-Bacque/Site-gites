import useInput from "../../../hooks/use-input";
import { useHistory } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";
import { useAppDispatch } from "../../../hooks/use-store";

import Input from "../Input";
import Card from "../../UI/Card";
import classes from "./style.module.css";
import { registerRequest, loginRequest } from "../../../lib/api";
import Loader from "../Loader";
import { authActions } from "../../../store/auth";
// types import
import { UserData } from "./types";

// component
const Auth: React.FC = () => {
  const { sendHttpRequest: loginHttpRequest, statut: loginStatut } =
    useHttp(loginRequest);
  const { sendHttpRequest: registerHttpRequest, statut: registerStatut } =
    useHttp(registerRequest);
  const {
    value: usernameValue,
    isValid: usernameIsValid,
    isTouched: usernameIsTouched,
    changeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
  } = useInput();
  const {
    value: userEmailValue,
    isValid: userEmailIsValid,
    isTouched: userEmailIsTouched,
    changeHandler: userEmailChangeHandler,
    blurHandler: userEmailBlurHandler,
  } = useInput();
  const {
    value: userPasswordValue,
    isValid: userPasswordIsValid,
    isTouched: userPasswordIsTouched,
    changeHandler: userPasswordChangeHandler,
    blurHandler: userPasswordBlurHandler,
    resetHandler: resetUserPasswordHandler,
    passwordState: userPasswordState,
  } = useInput();
  const [isNotRegistered, setIsNotRegistered] = useState(false);
  const [statutContent, setStatutContent] = useState<JSX.Element | null>(null);
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

    let userData: UserData = {
      username: usernameValue,
      password: userPasswordValue,
    };

    if (isNotRegistered) {
      userData.email = userEmailValue;
      registerHttpRequest(userData);
    } else {
      loginHttpRequest(userData);
    }

    resetUserPasswordHandler();
  };

  const handleClick = () => {
    setStatutContent(null);
    resetUserPasswordHandler();
    setIsNotRegistered(!isNotRegistered);
  };

  const handleLogin = useCallback(
    (statut: HTTPStateKind) => {
      if (statut === HTTPStateKind.SUCCESS) {
        dispatch(authActions.login());
        history.replace("/");
      }
    },
    [dispatch, history]
  );

  // login
  useEffect(() => {
    loginStatut &&
      setStatutContent(
        <Loader
          statut={loginStatut}
          onRequestEnd={handleLogin}
          message={{
            success: null,
            error: "Pseudo ou Mot de passe incorrect.",
          }}
        />
      );
  }, [loginStatut, handleLogin]);

  // register
  useEffect(() => {
    registerStatut &&
      setStatutContent(
        <Loader
          statut={registerStatut}
          onRequestEnd={() => setIsNotRegistered(false)}
          message={{
            success: "Enregistrement réussi.",
            error: "Enregistrement impossible.",
          }}
        />
      );
  }, [registerStatut, history]);

  return (
    <>
      {statutContent}
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
              placeholder="Taper votre pseudo ici"
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
                placeholder="Taper votre email ici"
              />
            )}
            <Input
              label="Mot de passe"
              forgotPassword={
                <a href="#" className={classes["auth__link"]}>
                  {!isNotRegistered && "Oubli ?"}
                </a>
              }
              isVisible={true}
              className={
                !userPasswordIsValid && userPasswordIsTouched
                  ? "form__input--red"
                  : ""
              }
              id="user-password"
              onChange={userPasswordChangeHandler}
              onBlur={userPasswordBlurHandler}
              type="password"
              value={userPasswordValue}
              placeholder="Taper votre mot de passe ici"
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
            <span>
              {!isNotRegistered
                ? "Vous n'avez pas de compte ?"
                : "Vous avez un compte ?"}
            </span>
            <a href="#" onClick={handleClick} className={classes["auth__link"]}>
              {!isNotRegistered ? "S'enregistrer ?" : "Se connecter ?"}
            </a>
          </div>
        </form>
      </Card>
    </>
  );
};

export default Auth;
