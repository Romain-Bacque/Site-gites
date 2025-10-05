import React, { useEffect } from "react";
import useInput from "../../../../hooks/use-input";
import useHttp from "../../../../hooks/use-http";

import Card from "../../../UI/Card";
import Input from "../../Input";
import classes from "../style.module.css";
import { forgotPasswordRequest } from "../../../../lib/api";
// types import
import { UserData } from "./types";
import { HTTPStateKind } from "../../../../global/types";
import useHTTPState from "../../../../hooks/use-http-state";

// component
const ForgotPassword: React.FC = () => {
  const {
    sendHttpRequest: forgotPasswordHttpRequest,
    statut: forgotPasswordStatut,
    error: forgotPasswordErrorMessage,
  } = useHttp(forgotPasswordRequest);
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

    const userData: UserData = {
      email: userEmailValue,
    };

    forgotPasswordHttpRequest(userData);
  };

  // login request loading handling
  useEffect(() => {
    if (forgotPasswordStatut) {
      handleHTTPState(
        forgotPasswordStatut
      );
    }
    // clear input
    if (forgotPasswordStatut === HTTPStateKind.SUCCESS) {
      userEmailResetHandler();
    }
  }, [forgotPasswordErrorMessage, forgotPasswordStatut, handleHTTPState, userEmailResetHandler]);

  return (
    <Card className={classes.auth}>
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>
          Réinitialisation Du Mot De Passe
        </h3>
        <div>
          <Input
            label="Email"
            isVisible={true}
            className={
              !userEmailIsValid && userEmailIsTouched ? "form__input--red" : ""
            }
            id="user-email"
            onChange={userEmailChangeHandler}
            onBlur={userEmailBlurHandler}
            type="email"
            value={userEmailValue}
            placeholder="Taper l'adresse email ici"
          />
          <button
            disabled={!userEmailIsValid}
            className={`button ${classes["auth__button"]}`}
          >
            Envoyer un mail de réinitialisation
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ForgotPassword;
