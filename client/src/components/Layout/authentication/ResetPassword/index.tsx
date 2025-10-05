// hooks import
import React, { useEffect, useState } from "react";
import useInput from "../../../../hooks/use-input";
import useHttp from "../../../../hooks/use-http";
import { useParams } from "react-router-dom";
// types import
import { UserData } from "./types";
// other import
import Card from "../../../UI/Card";
import Input from "../../Input";
import classes from "../style.module.css";
import {
  getCSRF,
  resetPasswordRequest,
  setCSRFToken,
} from "../../../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { HTTPStateKind } from "../../../../global/types";
import useHTTPState from "../../../../hooks/use-http-state";

// component
const ResetPassword: React.FC = () => {
  const { id, token } = useParams<{ id: string; token: string }>();
  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const handleHTTPState = useHTTPState();
  const { sendHttpRequest: getCSRFttpRequest, data: CSRFData } =
    useHttp(getCSRF);
  const {
    sendHttpRequest: resetPasswordHttpRequest,
    statut: resetPasswordStatut,
    error: resetPasswordErrorMessage,
  } = useHttp(resetPasswordRequest);
  const {
    value: userPasswordValue,
    isValid: userPasswordIsValid,
    isTouched: userPasswordIsTouched,
    changeHandler: userPasswordChangeHandler,
    blurHandler: userPasswordBlurHandler,
    resetHandler: userPasswordResetHandler,
    passwordState: userPasswordState,
  } = useInput();

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userPasswordIsValid) return;

    const userPassword: UserData = {
      id,
      token,
      password: userPasswordValue,
    };

    resetPasswordHttpRequest(userPassword);
  };

  // get csrf token
  useEffect(() => {
    getCSRFttpRequest();
  }, [getCSRFttpRequest]);

  // set csrf token
  useEffect(() => {
    setCSRFToken(CSRFData);
  }, [CSRFData]);

  // reset password request loading handling
  useEffect(() => {
    switch (resetPasswordStatut) {
      case HTTPStateKind.PENDING:
        handleHTTPState(1);
        break;
      case HTTPStateKind.SUCCESS:
        handleHTTPState(2, "Le mot de passe a été réinitialisé avec succès.");
        userPasswordResetHandler();
        break;
      case HTTPStateKind.ERROR:
        handleHTTPState(
          3,
          resetPasswordErrorMessage ?? "Une erreur est survenue."
        );
        break;
      default:
        break;
    }
  }, [
    handleHTTPState,
    resetPasswordErrorMessage,
    resetPasswordStatut,
    userPasswordResetHandler,
  ]);

  return (
    <Card className={classes.auth}>
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>
          Réinitialiser Le Mot De Passe
        </h3>
        <div>
          <Input
            icon={
              <FontAwesomeIcon
                className={classes.form__icon}
                onClick={() => setIsPasswordMasked((prevState) => !prevState)}
                icon={isPasswordMasked ? faEyeSlash : faEye}
              />
            }
            label="Mot de passe"
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
          <button
            disabled={!userPasswordIsValid}
            className={`button ${classes["auth__button"]}`}
          >
            Enregistrer
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ResetPassword;
