import React, { useCallback, useEffect, useRef, useState } from "react";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";
import { useAppDispatch } from "../../../hooks/use-store";

import {
  bookingsGetRequest,
  acceptBookingRequest,
  refuseBookingRequest,
  bookingRequestData,
} from "../../../lib/api";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSliders} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { emailHandler } from "../../../lib/emailjs";
import Modal from "../../UI/Modal";
import Sort from "../Sort";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Alert, { AlertKind } from "../../UI/Alert";
// types import
import {
  SortKind,
  BookingRef,
  BookingsList,
  handleEmailFormDisplay,
  ModalState,
  AlertStatut,
} from "./types";
import { loadingActions } from "../../../store/loading";
import BookingCard from "./BookingCard";

dayjs().format();

// variable & constante
const initialModalState = {
  show: false,
  booking: false,
  isSorted: false,
};
const initialMessageState = {
  message: "",
  alert: null,
  show: false,
};
const initialBookingRefState = { value: null, bookingChoice: null };

// component
const AllBookings: React.FC = () => {
  const [showModal, setShowModal] = useState<ModalState>(initialModalState);
  const [statutMessage, setAlertStatut] =
    useState<AlertStatut>(initialMessageState);
  const [bookingsList, setBookingsList] = useState<BookingsList>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const dispatch = useAppDispatch()

  const bookingRef = useRef<BookingRef>(initialBookingRefState);

  const {
    sendHttpRequest: getBookingsHttpRequest,
    statut: getBookingsRequestStatut,
    data: bookingsData,
    error: getBookingRequestError
  } = useHttp(bookingsGetRequest);
  const {
    sendHttpRequest: acceptBookingHttpRequest,
    statut: acceptBookingStatut,
    error: acceptBookingRequestError
  } = useHttp(acceptBookingRequest);
  const {
    sendHttpRequest: refuseBookingHttpRequest,
    statut: refuseBookingStatut,
    error: refuseBookingRequestError
  } = useHttp(refuseBookingRequest);

  const displayError = () => {
    setAlertStatut({
      message: "Une erreur est survenue",
      alert: AlertKind.ERROR,
      show: true,
    });
  };

  const handleBookingSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setShowModal(initialModalState);

      const statutMessage =
        bookingRef.current.bookingChoice === "accept"
          ? "acceptée"
          : "malheureusement refusée";

      const template = {
        statutMessage,
        ...bookingRef.current.value,
        message: textareaValue,
      };

      delete template.bookingId;

      try {
        const response = await emailHandler.sendEmail(template);

        if (response.status !== 200) throw new Error();
      } catch (err) {
        displayError();
      }

      if (bookingRef.current.value) {
        if (bookingRef.current.bookingChoice === "accept") {
          acceptBookingHttpRequest(bookingRef.current.value.bookingId);
        } else refuseBookingHttpRequest(bookingRef.current.value.bookingId);
      }
    },
    [acceptBookingHttpRequest, refuseBookingHttpRequest, textareaValue]
  );

  const handleCancel = () => {
    setTextareaValue("");
    setShowModal(initialModalState);
  };

  const handleEmailFormDisplay: handleEmailFormDisplay = useCallback(
    (bookingChoice, data) => {
      // Store the datas in a ref
      bookingRef.current.value = data;
      bookingRef.current.bookingChoice = bookingChoice;

      // Show the modal
      setShowModal({
        isSorted: false,
        booking: true,
        show: true,
      });
    },
    []
  );

  const handleSort = useCallback(
    (sort: SortKind | null) => {
      if (sort) {
        const arrayToSort = bookingsList;

        arrayToSort.sort((a, b) => {
          let result = 0;

          switch (sort) {
            case SortKind.DATE_DECREASING:
              // valueOf() return the actual date value in milliseconds since midnight, January 1, 1970, to fit with TS constraint
              result = new Date(a.from).valueOf() - new Date(b.from).valueOf();
              break;
            case SortKind.DATE_INCREASING:
              result = new Date(b.from).valueOf() - new Date(a.from).valueOf();
              break;
            case SortKind.AWAITING:
              result = new Date(a.from).valueOf() - new Date(b.from).valueOf();
              break;
            case SortKind.BOOKED:
              result = +b.booked - +a.booked; // +true = 1, +false = 0
              break;
            default:
              console.log("an error has occured.");
          }
          return result;
        });

        setBookingsList(arrayToSort);
        // handleAllBookings();
      }
      setShowModal(initialModalState);
    },
    [bookingsList]
  );

  useEffect(() => {
    bookingsData && setBookingsList(bookingsData);
  }, [bookingsData]);

  useEffect(() => {
    getBookingsHttpRequest();
  }, [getBookingsHttpRequest]);

  // get booking request loading statut
  useEffect(() => {
    if (getBookingsRequestStatut) {
      dispatch(loadingActions.setStatut(getBookingsRequestStatut))
      dispatch(loadingActions.setMessage({
        success: null,
        error: getBookingRequestError
      }))
    }
  }, [getBookingsRequestStatut])

  // accept booking request loading statut
  useEffect(() => {
    if (acceptBookingStatut) {
      dispatch(loadingActions.setStatut(acceptBookingStatut))
      dispatch(loadingActions.setMessage({
        success: "Réservation accepté avec succés, verifiez votre mail de confirmation.",
        error: acceptBookingRequestError
      }))
    }
  }, [acceptBookingStatut])

  // refuse booking request loading statut
  useEffect(() => {
    if (refuseBookingStatut) {
      dispatch(loadingActions.setStatut(refuseBookingStatut))
      dispatch(loadingActions.setMessage({
        success: "Réservation refusé/annulé avec succés.",
        error: refuseBookingRequestError
      }))
    }
  }, [refuseBookingStatut])

  return (
    <>
      <Modal
        show={showModal.show}
        onHide={() => setShowModal(initialModalState)}
      >
        <>
          {showModal.booking ? (
            <form className={classes["message-form"]} onSubmit={handleBookingSubmit}>
              <h3>Message à joindre</h3>
              <textarea className={classes["message-form__textarea"]} rows={10} cols={25} />
              <div className="button-container">
                <button className="button">Envoyer</button>
                <button className="button button--alt" type="button" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          ) : null}
          {showModal.isSorted ? <Sort onSortValidation={handleSort} /> : null}
        </>
      </Modal>
      <Alert
        message={statutMessage.message}
        alert={statutMessage.alert}
        show={statutMessage.show}
        onAlertClose={() =>
          setAlertStatut((prevState) => ({ ...prevState, show: false }))
        }
      />
      <section>
        <div className={classes["bookings__title-container"]}>
          <h2 className={classes["bookings__title"]}>{`Liste des demandes (${
            bookingsList ? bookingsList.length : "0"
          })`}</h2>
          {bookingsList?.length ? (
            <button
              onClick={() => {
                setShowModal({
                  isSorted: true,
                  booking: false,
                  show: true,
                });
              }}
              className={classes["sort-button"]}
            >
              <FontAwesomeIcon
                className={classes["sort-button__icon"]}
                icon={faSliders}
              />
              <span className={classes["sort-button__text"]}>Trier</span>
            </button>
          ) : null}
        </div>
        {getBookingsRequestStatut === HTTPStateKind.SUCCESS && (
          bookingsList?.length > 0 ? (
            <Swiper
              modules={[
                Navigation,
                Pagination,
              ]}
              effect="coverflow"
              grabCursor
              centeredSlides
              spaceBetween={10}
              navigation
              pagination={{ clickable: true }}
              className={classes.bookings__list}
            >           
              {bookingsList.map((booking) => (
                <SwiperSlide key={booking._id}>
                  <BookingCard                    
                    booking={booking}
                    onChoice={handleEmailFormDisplay}
                  />                  
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center">
              Il n'y a actuellement aucune réservation.
            </p>
          )   
        )}
      </section>
    </>
  );
};

export default AllBookings;
