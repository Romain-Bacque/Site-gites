import useInput from "../../../../hooks/use-input";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useHttp from "../../../../hooks/use-http";
import { useAppDispatch } from "../../../../hooks/use-store";

import Input from "../../Input";
import Card from "../../../UI/Card";
import classes from "../style.module.css";
import { registerRequest, loginRequest } from "../../../../lib/api";
import { authActions } from "../../../../store/auth";
// types import
import { LoginData } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { loadingActions } from "../../../../store/loading";
import { HandleLoading, HTTPStateKind } from "../../../../global/types";

// component
const Auth: React.FC = () => {
  const {
    sendHttpRequest: loginHttpRequest,
    statut: loginStatut,
    data: loginData,
    error: loginErrorMessage,
  } = useHttp(loginRequest);
  const {
    sendHttpRequest: registerHttpRequest,
    statut: registerStatut,
    error: registerRequestError,
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
    usernameResetHandler();
    userEmailResetHandler();
    userPasswordResetHandler();
    setIsNotRegistered(!isNotRegistered);
  };

  const handleLoading: HandleLoading = (statut, success, error) => {
    dispatch(loadingActions.setStatut(statut))
    dispatch(loadingActions.setMessage({
      success,
      error
    }))
  }

  // login request loading handling
  useEffect(() => {
    const userName = loginData ? loginData.username : ""

    if (loginStatut) {
      handleLoading(loginStatut, `Bienvenue ${userName}`, loginErrorMessage); 
    }
    // if user is logged successfully, then we set 'isAuthentificated' to true in store,
    // and redirect to home page
    if (loginStatut === HTTPStateKind.SUCCESS && !isNotRegistered) {      
        dispatch(authActions.login());
        history.replace("/");
    }
  }, [loginStatut])

  // register request loading handling
  useEffect(() => {    
    if (registerStatut) {
      handleLoading(registerStatut, "Enregistrement réussi.", registerRequestError);
    }
    // if user is registered successfully, then all input are cleared
    if (registerStatut === HTTPStateKind.SUCCESS && isNotRegistered) {
        usernameResetHandler();
        userEmailResetHandler();
        userPasswordResetHandler();
    }
  }, [registerStatut])

  return (
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
            <button disabled={!isFormValid} className={`button ${classes["auth__button"]}`}>
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
  );
};

export default Auth;
