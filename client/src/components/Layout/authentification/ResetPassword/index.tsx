import React, { useEffect, useState } from "react";
import useInput from "../../../../hooks/use-input";

import useHttp, { HTTPStateKind } from "../../../../hooks/use-http";
import Alert, { AlertKind } from "../../../UI/Alert";
import Card from "../../../UI/Card";
import Input from "../../Input";
import { StatutMessage, UserData } from "./types";
import classes from "../style.module.css";
import { forgotPasswordRequest } from "../../../../lib/api";

// types import

// variable & constante
const initialMessageState = {
  message: "",
  alert: null,
  show: false,
};

// component
const ForgotPassword: React.FC = () => {
  const [statutMessage, setStatutMessage] =
    useState<StatutMessage>(initialMessageState);
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
  } = useInput();

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userEmailIsValid) return;

    let userData: UserData = {
      email: userEmailValue,
    };

    userData.email = userEmailValue;
    forgotPasswordHttpRequest(userData);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (forgotPasswordStatut === HTTPStateKind.SUCCESS) {
      setStatutMessage({
        message: "Mail de réinitialisation envoyé avec succés.",
        alert: AlertKind.SUCCESS,
        show: true,
      });
    } else if (forgotPasswordStatut === HTTPStateKind.ERROR) {
      setStatutMessage({
        message: "Adresse mail incorrecte.",
        alert: AlertKind.ERROR,
        show: true,
      });
    }

    timer = setTimeout(() => {
      setStatutMessage((prevState) => ({ ...prevState, show: false }));
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [forgotPasswordStatut]);

  return (
    <>
      <Alert
        message={statutMessage.message}
        alert={statutMessage.alert}
        show={statutMessage.show}
      />
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
            <button
              disabled={!userEmailIsValid}
              className={classes["auth__button"]}
            >
              Envoyer un mail de confirmation
            </button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default ForgotPassword;
