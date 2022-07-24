import { useCallback, useEffect, useState } from "react";
import useInput from "../../hooks/use-input";

import Loader from "./Loader";
import Modal from "../UI/Modal";
import icon_success from "../../img/icon_success.ico";
import icon_error from "../../img/icon_error.png";
import Input from "./Input";
import useHttp from "../../hooks/use-http";
import { bookingRequest } from "../../lib/api";
import classes from "./Booking.module.css";
import Planning from "./Planning";

let modalContent;

const Booking = ({ shelter }) => {
  const { sendHttpRequest, statut } = useHttp(bookingRequest);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState({
    show: false,
    input: null,
  });

  const {
    value: nameValue,
    isValid: nameIsValid,
    isTouched: nameIsTouched,
    changeHandler: nameChangeHandler,
    blurHandler: nameBlurHandler,
    resetHandler: resetNameHandler,
  } = useInput();
  const {
    value: emailValue,
    isValid: emailIsValid,
    isTouched: emailIsTouched,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    resetHandler: resetEmailHandler,
  } = useInput();
  const {
    value: phoneValue,
    isValid: phoneIsValid,
    isTouched: phoneIsTouched,
    changeHandler: phoneChangeHandler,
    blurHandler: phoneBlurHandler,
    resetHandler: resetPhoneHandler,
  } = useInput();
  const {
    value: personsValue,
    isValid: personsIsValid,
    isTouched: personsIsTouched,
    changeHandler: personsChangeHandler,
    blurHandler: personsBlurHandler,
    resetHandler: resetPersonsHandler,
  } = useInput();
  const {
    value: fromValue,
    isValid: fromIsValid,
    isTouched: fromIsTouched,
    valueHandler: fromValueHandler,
    blurHandler: fromBlurHandler,
    resetHandler: resetFromHandler,
  } = useInput();
  const {
    value: toValue,
    isValid: toIsValid,
    isTouched: toIsTouched,
    valueHandler: toValueHandler,
    blurHandler: toBlurHandler,
    resetHandler: resetToHandler,
  } = useInput();
  const {
    value: infosValue,
    changeHandler: infosChangeHandler,
    blurHandler: infosBlurHandler,
    resetHandler: resetInfosHandler,
  } = useInput();
  const isFormValid =
    nameIsValid &&
    personsIsValid &&
    phoneIsValid &&
    emailIsValid &&
    toIsValid &&
    fromIsValid;

  useEffect(() => {
    if (statut === "success" || statut === "error") setShowModal(true);
  }, [statut]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (!isFormValid) return;

    let userData = {
      shelter,
      name: nameValue,
      phone: phoneValue,
      numberOfPerson: personsValue,
      email: emailValue,
      from: fromValue,
      to: toValue,
      informations: infosValue,
    };

    sendHttpRequest(userData);
  };

  const handleHideCalendar = useCallback(() => {
    if (showCalendar.show) {
      setShowCalendar({ show: false, input: null });
    }
  }, [showCalendar.show]);

  useEffect(() => {
    window.addEventListener("click", handleHideCalendar);
  }, [handleHideCalendar]);

  const handleCalendarDisplay = (input) => {
    if (input === "from") {
      setShowCalendar({ show: true, input: "from" });
    } else if (input === "to") {
      setShowCalendar({ show: true, input: "to" });
    }
  };

  const handleDateChoice = useCallback(
    (input, value) => {
      if (input === "from") {
        fromValueHandler(value);
      } else if (input === "to") {
        toValueHandler(value);
      }
    },
    [fromValueHandler, toValueHandler]
  );

  useEffect(() => {
    if (statut === "success") {
      modalContent = (
        <>
          <img
            className={classes["modal__icon"]}
            src={icon_success}
            alt="success"
          />
          <div>
            <p className={`${classes["modal__text"]} green bold`}>
              Votre demande a bien été envoyé !
            </p>
            <p className={`${classes["modal__text"]} green`}>
              Nous vous la confirmerons par mail dès que possible.
            </p>
          </div>
          <button
            className={`${classes["modal__button"]} ${classes["modal__button--success"]}`}
            type="button"
            onClick={() => setShowModal(false)}
          >
            OK
          </button>
        </>
      );

      resetNameHandler();
      resetPersonsHandler();
      resetEmailHandler();
      resetPhoneHandler();
      resetFromHandler();
      resetToHandler();
      resetInfosHandler();
    } else if (statut === "error") {
      modalContent = (
        <>
          <img
            className={classes["modal__icon"]}
            src={icon_error}
            alt="success"
          />
          <div>
            <p className={`${classes["modal__text"]} red bold`}>
              Une erreur est survenue !
            </p>
            <p className={`${classes["modal__text"]} red`}>
              Echec de l'envoi de votre demande.
            </p>
          </div>
          <button
            className={`${classes["modal__button"]} ${classes["modal__button--error"]}`}
            type="button"
            onClick={() => setShowModal(false)}
          >
            OK
          </button>
        </>
      );
    }
  }, [
    statut,
    resetNameHandler,
    resetPersonsHandler,
    resetEmailHandler,
    resetPhoneHandler,
    resetFromHandler,
    resetToHandler,
    resetInfosHandler,
  ]);

  return (
    <>
      <Modal show={showModal}>{modalContent}</Modal>
      {statut === "send" && <Loader />}
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes["form__input-container"]}>
          <Input
            label="Prénom et Nom"
            visible="true"
            className={!nameIsValid && nameIsTouched && "form__input--red"}
            input={{
              id: `name-shelter${shelter}`,
              onChange: nameChangeHandler,
              onBlur: nameBlurHandler,
              type: "text",
              value: nameValue,
              placeholder: "Prénom et Nom",
            }}
          />
          <Input
            label="Email"
            visible="true"
            className={!emailIsValid && emailIsTouched && "form__input--red"}
            input={{
              id: `email-shelter${shelter}`,
              onChange: emailChangeHandler,
              onBlur: emailBlurHandler,
              type: "email",
              value: emailValue,
              placeholder: "Adresse mail",
            }}
          />
          <Input
            label="Téléphone"
            visible="true"
            className={!phoneIsValid && phoneIsTouched && "form__input--red"}
            input={{
              id: `phone-shelter${shelter}`,
              onChange: phoneChangeHandler,
              onBlur: phoneBlurHandler,
              type: "tel",
              value: phoneValue,
              placeholder: "Numéro de téléphone",
            }}
          />
          <Input
            label="Nombre de personnes"
            visible="true"
            className={
              !personsIsValid && personsIsTouched && "form__input--red"
            }
            input={{
              id: `persons-shelter${shelter}`,
              onChange: personsChangeHandler,
              onBlur: personsBlurHandler,
              min: "1",
              max: "4",
              type: "number",
              value: personsValue,
              placeholder: "4 personnes max",
            }}
          />
        </div>
        <div className={classes["form__input-container"]}>
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            className={classes["form__date-container"]}
          >
            {showCalendar.show && showCalendar.input === "from" && (
              <Planning
                className="react-calendar--booking"
                onDateChoice={handleDateChoice.bind(null, "from")}
              />
            )}
            <Input
              onInputDateClick={handleCalendarDisplay.bind(null, "from")}
              label="Arrivée"
              visible="true"
              className={!fromIsValid && fromIsTouched && "form__input--red"}
              input={{
                readOnly: true,
                id: `from-shelter${shelter}`,
                onBlur: fromBlurHandler,
                type: "date",
                value: fromValue,
              }}
            />
          </div>
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            className={classes["form__date-container"]}
          >
            {showCalendar.show && showCalendar.input === "to" && (
              <Planning
                className="react-calendar--booking"
                onDateChoice={handleDateChoice.bind(null, "to")}
              />
            )}
            <Input
              onInputDateClick={handleCalendarDisplay.bind(null, "to")}
              label="Départ"
              visible="true"
              className={!toIsValid && toIsTouched && "form__input--red"}
              input={{
                readOnly: true,
                id: `to-shelter${shelter}`,
                onBlur: toBlurHandler,
                type: "date",
                value: toValue,
              }}
            />
          </div>
          <textarea
            className={classes["form__textarea"]}
            id={`info-shelter${shelter}`}
            onChange={infosChangeHandler}
            onBlur={infosBlurHandler}
            value={infosValue}
            rows="7"
            cols="19"
            maxLength="150"
            placeholder="Information(s) complémentaire"
          ></textarea>
        </div>
        <button
          disabled={!isFormValid}
          className={classes.form__button}
          type="submit"
        >
          Valider
        </button>
      </form>
    </>
  );
};

export default Booking;
