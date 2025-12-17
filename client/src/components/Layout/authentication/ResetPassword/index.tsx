// hooks import
import React, { useEffect, useState } from "react";
import useInput from "../../../../hooks/use-input";
import { useMyQuery, useMyMutation } from "../../../../hooks/use-query";
// types import
// other import
import Card from "../../../UI/Card";
import Input from "../../Input";
import classes from "../style.module.css";
import { getCSRF, resetPasswordRequest } from "../../../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useHTTPState from "../../../../hooks/use-http-state";

// component
const ResetPassword: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id") || "";
  const token = queryParams.get("token") || "";
  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const handleHTTPState = useHTTPState();

  // fetch CSRF token on mount (useMyQuery handles status via useHTTPState internally)
  useMyQuery({
    queryKey: ["getCSRF"],
    queryFn: getCSRF,
  });

  const {
    value: userPasswordValue,
    isValid: userPasswordIsValid,
    isTouched: userPasswordIsTouched,
    changeHandler: userPasswordChangeHandler,
    blurHandler: userPasswordBlurHandler,
    resetHandler: userPasswordResetHandler,
    passwordState: userPasswordState,
  } = useInput();

  // mutation for resetting password
  const { mutate: resetPasswordMutate, status: resetPasswordStatus } =
    useMyMutation({
      mutationFn: resetPasswordRequest,
      onErrorFn: (_err, errorMessage) => {
        handleHTTPState("error", errorMessage || "Une erreur est survenue.");
      },
      onSuccessFn: () => {
        handleHTTPState(
          "success",
          "Le mot de passe a été réinitialisé avec succès."
        );
        userPasswordResetHandler();
      },
    });

  // show pending state when mutation is loading
  useEffect(() => {
    if (resetPasswordStatus === "pending") {
      handleHTTPState("pending");
    }
  }, [resetPasswordStatus, handleHTTPState]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userPasswordIsValid) return;

    if (!id || !token) {
      handleHTTPState("error", "Lien de réinitialisation invalide.");
      return;
    }

    const userPassword = {
      id,
      token,
      password: userPasswordValue,
    };

    resetPasswordMutate(userPassword);
  };

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
