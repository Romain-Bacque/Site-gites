import React, { useEffect, useState } from "react";
import useInput from "../../../../hooks/use-input";

import useHttp, { HTTPStateKind } from "../../../../hooks/use-http";
import Alert, { AlertKind } from "../../../UI/Alert";
import Card from "../../../UI/Card";
import Input from "../../Input";
import { StatutMessage, UserData } from "./types";
import classes from "../style.module.css";
import { forgotPasswordRequest } from "../../../../lib/api";
import LoaderAndAlert from "../../LoaderAndAlert";

// types import

// variable & constante
const initialMessageState = {
  message: "",
  alert: null,
  show: false,
};

// component
const ForgotPassword: React.FC = () => {
  const [loaderAndAlert, setLoaderAndAlert] = useState<JSX.Element | null>(
    null
  );
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

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userEmailIsValid) return;

    const userData: UserData = {
      email: userEmailValue,
    };

    forgotPasswordHttpRequest(userData);
  };

  // reset input
  const handleServerResponse = (statut: HTTPStateKind) => {
    if (statut === HTTPStateKind.SUCCESS) {
      userEmailResetHandler();
    }
  };

  useEffect(() => {
    forgotPasswordStatut &&
      setLoaderAndAlert(
        <LoaderAndAlert
          statut={forgotPasswordStatut}
          onServerResponse={handleServerResponse}
          message={{
            success: "Enregistrement réussi.",
            error: forgotPasswordErrorMessage,
          }}
        />
      );
  }, [forgotPasswordStatut]);

  return (
    <>
      {loaderAndAlert}
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
              placeholder="Taper l'adresse email ici"
            />
            <button
              disabled={!userEmailIsValid}
              className={classes["auth__button"]}
            >
              Envoyer un mail de réinitialisation
            </button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default ForgotPassword;
