// hooks import
import { useCallback, useEffect, useState } from "react";
import useInput from "../../../hooks/use-input";
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
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
import { bookingRequest, getCSRF } from "../../../lib/api";
import classes from "./style.module.css";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import useHTTPState from "../../../hooks/use-http-state";
import { useTranslation } from "react-i18next";

// variable & const
const initialState = {
  show: false,
  input: null,
};

// component
const Booking: React.FC<BookingProps> = ({ shelterId }) => {
  const { t } = useTranslation();
  const [calendarStatus, setCalendarStatus] =
    useState<CalendarStatus>(initialState);
  const handleHTTPState = useHTTPState();

  // useInput hooks
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

  // Use your custom hooks
  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  const { mutate: bookingMutate, status: bookingStatus } = useMyMutation({
    mutationFn: bookingRequest,
  });

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
      shelterId,
      name: nameValue,
      phone: phoneValue,
      numberOfPerson: +personsValue,
      email: emailValue,
      from: fromValue,
      to: toValue,
      informations: infosValue || "",
    };

    bookingMutate(userData);
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

    handleHTTPState(bookingStatus);

    if (bookingStatus === "success") {
      swalInstance.fire({
        title: t("booking.successTitle"),
        text: t("booking.successText"),
        icon: "success",
      });
      resetNameHandler();
      resetEmailHandler();
      resetPhoneHandler();
      resetPersonsHandler();
      resetFromHandler();
      resetToHandler();
      resetInfosHandler();
    } else if (bookingStatus === "error") {
      swalInstance.fire({
        title: t("booking.errorTitle"),
        text: t("booking.errorText"),
        icon: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bookingStatus,
    resetNameHandler,
    resetEmailHandler,
    resetPhoneHandler,
    resetPersonsHandler,
    resetFromHandler,
    resetToHandler,
    resetInfosHandler,
    handleHTTPState,
    t,
  ]);

  // prevent to set an arrival date > departure date
  useEffect(() => {
    if (new Date(toValue).valueOf() <= new Date(fromValue).valueOf()) {
      fromValueHandler("");
    }
  }, [fromValue, toValue, fromValueHandler]);

  return (
    <div className={classes["booking-container"]}>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes["form__input-container"]}>
          <Input
            label={t("booking.nameLabel")}
            isVisible={true}
            required
            className={!nameIsValid && nameIsTouched ? "form__input--red" : ""}
            id={`name-shelter${shelterId}`}
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            type="text"
            value={nameValue}
            placeholder={t("booking.namePlaceholder")}
          />
          <Input
            label={t("booking.emailLabel")}
            isVisible={true}
            required
            className={
              !emailIsValid && emailIsTouched ? "form__input--red" : ""
            }
            id={`email-shelter${shelterId}`}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            type="email"
            value={emailValue}
            placeholder={t("booking.emailPlaceholder")}
          />
          <Input
            label={t("booking.phoneLabel")}
            isVisible={true}
            required
            className={
              !phoneIsValid && phoneIsTouched ? "form__input--red" : ""
            }
            id={`phone-shelter${shelterId}`}
            onChange={phoneChangeHandler}
            onBlur={phoneBlurHandler}
            type="tel"
            value={phoneValue}
            placeholder={t("booking.phonePlaceholder")}
          />
          <Input
            label={t("booking.personsLabel")}
            isVisible={true}
            required
            className={
              !personsIsValid && personsIsTouched ? "form__input--red" : ""
            }
            id={`persons-shelter${shelterId}`}
            onChange={personsChangeHandler}
            onBlur={personsBlurHandler}
            min="1"
            max="4"
            type="number"
            value={personsValue}
            placeholder={t("booking.personsPlaceholder")}
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
                shelterId={shelterId}
              />
            )}
            <Input
              onInputDateClick={handleCalendarDisplay.bind(null, "from")}
              label={t("booking.fromLabel")}
              isVisible={true}
              className={
                !fromIsValid && fromIsTouched ? "form__input--red" : ""
              }
              readOnly={true}
              id={`from-shelter${shelterId}`}
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
                shelterId={shelterId}
              />
            )}
            <Input
              onInputDateClick={handleCalendarDisplay.bind(null, "to")}
              label={t("booking.toLabel")}
              isVisible={true}
              className={!toIsValid && toIsTouched ? "form__input--red" : ""}
              readOnly={true}
              id={`to-shelter${shelterId}`}
              onBlur={toBlurHandler}
              type="date"
              value={dayjs(toValue).format("YYYY-MM-DD")}
            />
          </div>
          <textarea
            className={classes["form__textarea"]}
            id={`info-shelter${shelterId}`}
            onChange={infosChangeHandler}
            onBlur={infosBlurHandler}
            value={infosValue}
            rows={7}
            cols={19}
            maxLength={150}
            placeholder={t("booking.infosPlaceholder")}
          />
        </div>
        <button
          className="button button--alt"
          disabled={!isFormValid}
          type="submit"
        >
          {t("booking.sendButton")}
        </button>
      </form>
    </div>
  );
};

export default Booking;
