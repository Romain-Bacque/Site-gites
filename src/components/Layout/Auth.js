import useInput from "../../hooks/use-input";
import Input from "./Input";
import Card from "../UI/Card";
import classes from "./Auth.module.css";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import { registerRequest, loginRequest } from "../../lib/api";
import Loader from "./Loader";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { useHistory } from "react-router-dom";

const Auth = () => {
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
    resetHandler: resetUsernameHandler,
  } = useInput();
  const {
    value: userEmailValue,
    isValid: userEmailIsValid,
    isTouched: userEmailIsTouched,
    changeHandler: userEmailChangeHandler,
    blurHandler: userEmailBlurHandler,
    resetHandler: resetUserEmailHandler,
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
  const dispatch = useDispatch();
  const history = useHistory();
  const [statutContent, setStatutContent] = useState();

  let isFormValid;

  // Si l'user veut s'enregistrer
  if (isNotRegistered) {
    isFormValid = usernameIsValid && userEmailIsValid && userPasswordIsValid;
    // Sinon, si il veut se connecter
  } else {
    isFormValid = usernameIsValid && userPasswordIsValid;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    let userData = {
      username: usernameValue,
      password: userPasswordValue,
    };

    // Si l'utilisateur veut s'enregistrer, on ajoute son pseudo dans userData
    if (isNotRegistered) {
      userData.email = userEmailValue;
      registerHttpRequest(userData);
      // Sinon, si il veut se connecter
    } else {
      loginHttpRequest(userData);
    }

    resetUserPasswordHandler();
  };

  // Toggle between sign in/sign up
  const handleClick = () => {
    resetUserPasswordHandler();
    setIsNotRegistered(!isNotRegistered);
  };

  const handleLogin = () => {
    dispatch(authActions.login());
    history.replace("/");
  };

  // login
  useEffect(() => {
    {
      loginStatut &&
        setStatutContent(
          <Loader
            statut={loginStatut}
            onSuccess={handleLogin}
            message={{
              success: null,
              error: "Mot de passe ou Pseudo incorrect(s).",
            }}
          />
        );
    }
  }, [loginStatut]);

  // register
  useEffect(() => {
    {
      registerStatut &&
        setStatutContent(
          <Loader
            statut={registerStatut}
            onSuccess={() => setIsNotRegistered(false)}
            message={{
              success: "Enregistrement réussi.",
              error: "Enregistrement impossible.",
            }}
          />
        );
    }
  }, [registerStatut, history]);

  return (
    <Card className={classes.auth}>
      {statutContent}
      <form onSubmit={submitHandler} className={classes["auth__form"]}>
        <h3 className={classes["auth__title"]}>
          {isNotRegistered ? "Enregistrement" : "Connexion"}
        </h3>
        <div>
          <Input
            label="Pseudo"
            visible="true"
            className={
              !usernameIsValid && usernameIsTouched && "form__input--red"
            }
            input={{
              id: "user-name",
              onChange: usernameChangeHandler,
              onBlur: usernameBlurHandler,
              type: "texte",
              value: usernameValue,
              placeholder: "Taper votre pseudo ici",
            }}
          />
          {isNotRegistered && (
            <Input
              label="Email"
              visible="true"
              className={
                !userEmailIsValid && userEmailIsTouched && "form__input--red"
              }
              input={{
                id: "user-email",
                onChange: userEmailChangeHandler,
                onBlur: userEmailBlurHandler,
                type: "email",
                value: userEmailValue,
                placeholder: "Taper votre email ici",
              }}
            />
          )}
          <Input
            label="Mot de passe"
            forgotPassword={
              <a href="#" className={classes["auth__link"]}>
                {!isNotRegistered && "Oubli ?"}
              </a>
            }
            visible="true"
            className={
              !userPasswordIsValid &&
              userPasswordIsTouched &&
              "form__input--red"
            }
            input={{
              id: "user-password",
              onChange: userPasswordChangeHandler,
              onBlur: userPasswordBlurHandler,
              type: "password",
              value: userPasswordValue,
              placeholder: "Taper votre mot de passe ici",
            }}
          />
          {userPasswordState.length > 0 && (
            <ul className={classes["auth__password-error-list"]}>
              <span>Le mot de passe doit comporter:</span>
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
  );
};

export default Auth;
