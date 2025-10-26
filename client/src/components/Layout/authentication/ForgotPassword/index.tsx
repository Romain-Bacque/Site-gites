import React, { useEffect } from "react";
import useInput from "../../../../hooks/use-input";
import useHTTPState from "../../../../hooks/use-http-state";
import { useMyQuery, useMyMutation } from "../../../../hooks/use-query";

import Card from "../../../UI/Card";
import Input from "../../Input";
import classes from "../style.module.css";
import { forgotPasswordRequest, getCSRF } from "../../../../lib/api";
// types import
import { UserData } from "./types";

// component
const ForgotPassword: React.FC = () => {
  // load CSRF on mount using the custom query hook
  useMyQuery({
    queryFn: getCSRF,
    queryKey: ["getCSRF"],
  });

  const {
    mutate: forgotPasswordMutate,
    status: forgotPasswordStatus,
    error: forgotPasswordError,
  } = useMyMutation<UserData, any>({
    mutationFn: forgotPasswordRequest,
    // optional handlers can be passed here if you want to run side-effects on success/error
    // onSuccessFn: () => {},
    // onErrorFn: () => {},
  });

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

    forgotPasswordMutate(userData);
  };

  // mutation loading/finished handling (map to your global HTTP state)
  useEffect(() => {
    // derive an error message if needed (use the same helper you used elsewhere or map statuses)
    const errorMessage =
      (forgotPasswordError as any)?.response?.data?.message ||
      (forgotPasswordError as any)?.message ||
      "";

    handleHTTPState(forgotPasswordStatus, errorMessage);

    if (forgotPasswordStatus === "success") {
      userEmailResetHandler();
    }
  }, [
    forgotPasswordStatus,
    forgotPasswordError,
    handleHTTPState,
    userEmailResetHandler,
  ]);

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
