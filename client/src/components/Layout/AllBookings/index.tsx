import React, { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { useAppDispatch } from "../../../hooks/use-store";

import {
  bookingsGetRequest,
  acceptBookingRequest,
  refuseBookingRequest,
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
import Alert from "../../UI/Alert";
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
import { HandleLoading, HTTPStateKind } from "../../../global/types";

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
  const dispatch = useAppDispatch();

  const bookingRef = useRef<BookingRef>(initialBookingRefState);

  const {
    sendHttpRequest: getBookingsHttpRequest,
    statut: getBookingsRequestStatut,
    data: getBookingsRequestData,
    error: getBookingRequestError
  } = useHttp(bookingsGetRequest);
  const {
    sendHttpRequest: acceptBookingHttpRequest,
    statut: acceptBookingStatut,
    data: acceptBookingsRequestData,
    error: acceptBookingRequestError
  } = useHttp(acceptBookingRequest);
  const {
    sendHttpRequest: refuseBookingHttpRequest,
    statut: refuseBookingStatut,
    data: refuseBookingsRequestData,
    error: refuseBookingRequestError
  } = useHttp(refuseBookingRequest);

  const handleLoading: HandleLoading = (statut, success, error) => {
    dispatch(loadingActions.setStatut(statut))
    dispatch(loadingActions.setMessage({
      success,
      error
    }))
  }

  const handleBookingSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setShowModal(initialModalState);      

      if (bookingRef.current.value) {
        if (bookingRef.current.bookingChoice === "accept") {
          acceptBookingHttpRequest(bookingRef.current.value.bookingId);
        } else {
          refuseBookingHttpRequest(bookingRef.current.value.bookingId);
        }
      }
    },
    [acceptBookingHttpRequest, refuseBookingHttpRequest, textareaValue]
  );

  const sendEmailToClient = useCallback(async () => {
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
      handleLoading(
        HTTPStateKind.SUCCESS,
        "Modification enregistrée, un mail de confirmation vous a été envoyé.",
        null);
    } catch (err) {
      handleLoading(
        HTTPStateKind.ERROR,
        "Modification enregistrée, mais echec de l'envoi du mail de confirmation.",
        null);
    }

  }, [bookingRef])

  const handleCancel = () => {
    setTextareaValue("");
    setShowModal(initialModalState);
  };

  // Display the email form, then fill it out (optionnal) to send an email to the client
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
      }
      setShowModal(initialModalState);
    },
    [bookingsList]
  );
  
  // get all bookings list
  useEffect(() => {
    getBookingsHttpRequest();
  }, [getBookingsHttpRequest]);

  // refresh bookings list display on the screen
  useEffect(() => {
    getBookingsRequestData && setBookingsList(getBookingsRequestData);
  }, [getBookingsRequestData]);

  useEffect(() => {
    acceptBookingsRequestData && setBookingsList(acceptBookingsRequestData);
  }, [acceptBookingsRequestData]);

  useEffect(() => {
    refuseBookingsRequestData && setBookingsList(refuseBookingsRequestData);
  }, [refuseBookingsRequestData]);

  // get booking request loading statut
  useEffect(() => {
    if (getBookingsRequestStatut) {
      handleLoading(getBookingsRequestStatut, null, getBookingRequestError);     
    }
  }, [getBookingsRequestStatut])

  // accept booking request loading handling
  useEffect(() => {
    if (acceptBookingStatut === HTTPStateKind.PENDING) {
      handleLoading(acceptBookingStatut, null, null);
    } else if (acceptBookingStatut === HTTPStateKind.SUCCESS) {
      sendEmailToClient();
    } else if (acceptBookingStatut === HTTPStateKind.ERROR) {
      handleLoading(acceptBookingStatut, null, acceptBookingRequestError);
    }      
  }, [acceptBookingStatut]);

  // refuse booking request loading handling
  useEffect(() => {
    if (refuseBookingStatut === HTTPStateKind.PENDING) {
      handleLoading(refuseBookingStatut, null, null);
    } else if (refuseBookingStatut === HTTPStateKind.SUCCESS) {
      sendEmailToClient();
    } else if (refuseBookingStatut === HTTPStateKind.ERROR) {
      handleLoading(refuseBookingStatut, null, refuseBookingRequestError);
    }      
  }, [refuseBookingStatut]);

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
