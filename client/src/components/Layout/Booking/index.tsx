// hooks import
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import useInput from "../../../hooks/use-input";
import { useAppDispatch } from "../../../hooks/use-store";
// types import
import {
  BookingProps,
  bookingRequestData,
  CalendarStatus,
  HandleCalendarDisplay,
  HandleDateChoiceType,
} from "./types";
import Availability from "../Availability";
// other import
import Input from "../Input";
import { bookingRequest } from "../../../lib/api";
import classes from "./style.module.css";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { HTTPStateKind } from "../../../global/types";
import useLoading from "../../../hooks/use-loading";

// variable & contante
const initialState = {
  show: false,
  input: null,
};

// component
const Booking: React.FC<BookingProps> = ({ shelter }) => {
  const { sendHttpRequest: bookingHttpRequest, statut: bookingStatut } =
    useHttp(bookingRequest);
  const [calendarStatus, setCalendarStatus] =
    useState<CalendarStatus>(initialState);
  const dispatch = useAppDispatch();
  const handleLoading = useLoading()
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

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    const userData: bookingRequestData = {
      shelterId: shelter,
      name: nameValue,
      phone: phoneValue,
      numberOfPerson: +personsValue,
      email: emailValue,
      from: fromValue,
      to: toValue,
    };

    // if user input some complementary infos
    if (infosValue) userData.informations = infosValue;
    bookingHttpRequest(userData);
  };

  const handleCalendarDisplay: HandleCalendarDisplay = (input) => {
    if (input === "from") {
      setCalendarStatus({ show: true, input: "from" });
    } else if (input === "to") {
      setCalendarStatus({ show: true, input: "to" });
    }
  };

  const handleDateChoice: HandleDateChoiceType = useCallback(
    (input, value) => {
      if (input === "from") {
        fromValueHandler(value.toString());
      } else if (input === "to") {
        toValueHandler(value.toString());
      }
      setCalendarStatus(initialState);
    },
    [fromValueHandler, toValueHandler]
  );

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

  useEffect(() => {
    const swalInstance = Swal.mixin({
      customClass: {
        popup: "popup",
        confirmButton: "popup__btn",
      },
      buttonsStyling: false,
    });

    // loader display
    if (bookingStatut) {
      handleLoading(bookingStatut, null, null, null);
    }

    // popup display
    if (bookingStatut === HTTPStateKind.SUCCESS) {
      swalInstance.fire({
        title: "Demande Envoyée avec succès !",
        text: "Selon mes disponibilités, je la confirmerai par mail.",
        icon: "success",
      });
      resetNameHandler();
      resetEmailHandler();
      resetPhoneHandler();
      resetPersonsHandler();
      resetFromHandler();
      resetToHandler();
      resetInfosHandler();
    } else if (bookingStatut === HTTPStateKind.ERROR) {
      swalInstance.fire({
        title: "Echec de l'envoi de la demande",
        text: "Il y a peut-être une erreur dans un/plusieurs champs.",
        icon: "error",
      });
    }
  }, [
    dispatch,
    bookingStatut,
    resetNameHandler,
    resetEmailHandler,
    resetPhoneHandler,
    resetPersonsHandler,
    resetFromHandler,
    resetToHandler,
    resetInfosHandler,
  ]);

  // prevent to set an arrive date > depart date
  useEffect(() => {
    if (new Date(toValue).valueOf() <= new Date(fromValue).valueOf()) {
      fromValueHandler("");
    }
  }, [fromValue, toValue, fromValueHandler]);

  return (
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
          className={!emailIsValid && emailIsTouched ? "form__input--red" : ""}
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
          className={!phoneIsValid && phoneIsTouched ? "form__input--red" : ""}
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
            <Availability
              onDateChoice={handleDateChoice.bind(null, "from")}
              className="calendar--booking"
              shelter={shelter}
            />
          )}
          <Input
            onInputDateClick={handleCalendarDisplay.bind(null, "from")}
            label="Arrivée"
            isVisible={true}
            className={!fromIsValid && fromIsTouched ? "form__input--red" : ""}
            readOnly={true}
            id={`from-shelter${shelter}`}
            onBlur={fromBlurHandler}
            type="date"
            value={dayjs(fromValue).format("YYYY-MM-DD")}
          />
        </div>
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className={classes["form__date-container"]}
        >
          {calendarStatus.show && calendarStatus.input === "to" && (
            <Availability
              onDateChoice={handleDateChoice.bind(null, "to")}
              className="calendar--booking"
              shelter={shelter}
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
            value={dayjs(toValue).format("YYYY-MM-DD")}
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
        className="button button--alt"
        disabled={!isFormValid}
        type="submit"
      >
        Envoyer
      </button>
    </form>
  );
};

export default Booking;
