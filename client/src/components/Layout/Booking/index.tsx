import { useCallback, useEffect, useState } from "react";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";
import useInput from "../../../hooks/use-input";

import Loader from "../LoaderAndAlert";
import Modal from "../../UI/Modal";
import icon_success from "../../../img/icon_success.ico";
import icon_error from "../../../img/icon_error.png";
import Input from "../Input";
import { bookingRequest, bookingRequestData } from "../../../lib/api";
import classes from "./style.module.css";
import Planning from "../Planning";
// types import
import { BookingProps, CalendarStatus, HandleCalendarDisplay } from "./types";

// variable & contante
let modalContent: JSX.Element;
const initialState = {
  show: false,
  input: null,
};

// component
const Booking: React.FC<BookingProps> = ({ shelter }) => {
  const [showLoader, setShowLoader] = useState(false);
  const { sendHttpRequest: bookingHttpRequest, statut: bookingStatut } =
    useHttp(bookingRequest);
  const [showModal, setShowModal] = useState(false);
  const [calendarStatus, setCalendarStatus] =
    useState<CalendarStatus>(initialState);
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
    if (
      bookingStatut === HTTPStateKind.SUCCESS ||
      bookingStatut === HTTPStateKind.ERROR
    )
      setShowModal(true);
  }, [bookingStatut]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    const userData: bookingRequestData = {
      shelterId: shelter,
      name: nameValue,
      phone: phoneValue,
      numberOfPerson: personsValue,
      email: emailValue,
      from: fromValue,
      to: toValue,
      informations: infosValue,
    };

    bookingHttpRequest<bookingRequestData>(userData);
    setShowLoader(true);
  };

  useEffect(() => {
    const handleHideCalendar = () => {
      if (calendarStatus.show) {
        setCalendarStatus({ show: false, input: null });
      }
    };

    window.addEventListener("click", handleHideCalendar);

    return () => {
      window.removeEventListener("click", handleHideCalendar);
    };
  }, [calendarStatus.show]);

  const handleCalendarDisplay: HandleCalendarDisplay = (input) => {
    if (input === "from") {
      setCalendarStatus({ show: true, input: "from" });
    } else if (input === "to") {
      setCalendarStatus({ show: true, input: "to" });
    }
  };

  type HandleDateChoiceType = (input: any, value: any) => void;

  const handleDateChoice: HandleDateChoiceType = useCallback(
    (input, value) => {
      if (input === "from") {
        fromValueHandler(value);
      } else if (input === "to") {
        toValueHandler(value);
      }
      setCalendarStatus(initialState);
    },
    [fromValueHandler, toValueHandler]
  );

  useEffect(() => {
    if (bookingStatut === HTTPStateKind.SUCCESS) {
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
    } else if (bookingStatut === HTTPStateKind.ERROR) {
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
    bookingStatut,
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
      {showLoader && (
        <Loader
          statut={bookingStatut}
          onServerResponse={() => setShowLoader(false)}
        />
      )}
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes["form__input-container"]}>
          <Input
            label="Prénom et Nom"
            isVisible={true}
            className={!nameIsValid && nameIsTouched ? "form__input--red" : ""}
            id={`name-shelter${shelter}`}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            type="text"
            value={nameValue}
            placeholder="Prénom et Nom"
          />
          <Input
            label="Email"
            isVisible={true}
            className={
              !emailIsValid && emailIsTouched ? "form__input--red" : ""
            }
            id={`email-shelter${shelter}`}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            type="email"
            value={emailValue}
            placeholder="Adresse mail"
          />
          <Input
            label="Téléphone"
            isVisible={true}
            className={
              !phoneIsValid && phoneIsTouched ? "form__input--red" : ""
            }
            id={`phone-shelter${shelter}`}
            onChange={phoneChangeHandler}
            onBlur={phoneBlurHandler}
            type="tel"
            value={phoneValue}
            placeholder="Numéro de téléphone"
          />
          <Input
            label="Nombre de personnes"
            isVisible={true}
            className={
              !personsIsValid && personsIsTouched ? "form__input--red" : ""
            }
            id={`persons-shelter${shelter}`}
            onChange={personsChangeHandler}
            onBlur={personsBlurHandler}
            min="1"
            max="4"
            type="number"
            value={personsValue}
            placeholder="4 personnes max"
          />
        </div>
        <div className={classes["form__input-container"]}>
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            className={classes["form__date-container"]}
          >
            {calendarStatus.show && calendarStatus.input === "from" && (
              <Planning
                className="react-calendar--booking"
                onDateChoice={handleDateChoice.bind(null, "from")}
              />
            )}
            <Input
              onInputDateClick={handleCalendarDisplay.bind(null, "from")}
              label="Arrivée"
              isVisible={true}
              className={
                !fromIsValid && fromIsTouched ? "form__input--red" : ""
              }
              readOnly={true}
              id={`from-shelter${shelter}`}
              onBlur={fromBlurHandler}
              type="date"
              value={fromValue}
            />
          </div>
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
            className={classes["form__date-container"]}
          >
            {calendarStatus.show && calendarStatus.input === "to" && (
              <Planning
                className="react-calendar--booking"
                onDateChoice={handleDateChoice.bind(null, "to")}
              />
            )}
            <Input
              onInputDateClick={handleCalendarDisplay.bind(null, "to")}
              label="Départ"
              isVisible={true}
              className={!toIsValid && toIsTouched ? "form__input--red" : ""}
              readOnly={true}
              id={`to-shelter${shelter}`}
              onBlur={toBlurHandler}
              type="date"
              value={toValue}
            />
          </div>
          <textarea
            className={classes["form__textarea"]}
            id={`info-shelter${shelter}`}
            onChange={infosChangeHandler}
            onBlur={infosBlurHandler}
            value={infosValue}
            rows={7}
            cols={19}
            maxLength={150}
            placeholder="Information(s) complémentaire"
          />
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
