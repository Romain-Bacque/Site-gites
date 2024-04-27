// hooks import
import React, { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { useAppDispatch } from "../../../hooks/use-store";
// components import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../UI/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import BookingCard from "./BookingCard";
// types import
import {
  SortKind,
  BookingRef,
  BookingsList,
  handleEmailFormDisplay,
  ModalState,
} from "./types";
import {  HTTPStateKind } from "../../../global/types";
// other import
import {
  bookingsGetRequest,
  acceptBookingRequest,
  refuseBookingRequest,
} from "../../../lib/api";
import classes from "./style.module.css";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { emailHandler } from "../../../lib/emailjs";
import Sort from "../Sort";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useLoading from "../../../hooks/use-loading";

dayjs().format();

// variables & constantes
const initialModalState = {
  show: false,
  booking: false,
  isSorted: false,
};
const initialBookingRefState = { value: null, bookingChoice: null };

// component
const AllBookings: React.FC = () => {
  const [showModal, setShowModal] = useState<ModalState>(initialModalState);
  const [bookingsList, setBookingsList] = useState<BookingsList>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const bookingRef = useRef<BookingRef>(initialBookingRefState);
  const handleLoading = useLoading();

  const {
    sendHttpRequest: getBookingsHttpRequest,
    statut: fetchBookingsRequestStatut,
    data: fetchBookingsRequestData,
    error: fetchBookingRequestError,
  } = useHttp(bookingsGetRequest);
  const {
    sendHttpRequest: acceptBookingHttpRequest,
    statut: acceptBookingStatut,
    data: acceptBookingsRequestData,
    error: acceptBookingRequestError,
  } = useHttp(acceptBookingRequest);
  const {
    sendHttpRequest: refuseBookingHttpRequest,
    statut: refuseBookingStatut,
    data: refuseBookingsRequestData,
    error: refuseBookingRequestError,
  } = useHttp(refuseBookingRequest);

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
    [acceptBookingHttpRequest, refuseBookingHttpRequest]
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
        null,
        "Modification enregistrée, un mail de confirmation vous a été envoyé.",
        null
      );
    } catch (err) {
      handleLoading(
        HTTPStateKind.ERROR,
        null,
        "Modification enregistrée, mais echec de l'envoi du mail de confirmation.",
        null
      );
    }
  }, [bookingRef, handleLoading, textareaValue]);

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
    [bookingRef]
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
    fetchBookingsRequestData && setBookingsList(fetchBookingsRequestData);
  }, [fetchBookingsRequestData]);

  useEffect(() => {
    acceptBookingsRequestData && setBookingsList(acceptBookingsRequestData);
  }, [acceptBookingsRequestData]);

  useEffect(() => {
    refuseBookingsRequestData && setBookingsList(refuseBookingsRequestData);
  }, [refuseBookingsRequestData]);

  // get booking request loading statut
  useEffect(() => {
    if (fetchBookingsRequestStatut) {
      handleLoading(
        fetchBookingsRequestStatut,
        null,
        null,
        fetchBookingRequestError
      );
    }
  }, [fetchBookingsRequestStatut, fetchBookingRequestError, handleLoading]);

  // accept booking request handling
  useEffect(() => {
    if (acceptBookingStatut === HTTPStateKind.PENDING) {
      handleLoading(HTTPStateKind.PENDING, null, null, null);
    } else if (acceptBookingStatut === HTTPStateKind.SUCCESS) {
      sendEmailToClient();
    } else if (acceptBookingStatut === HTTPStateKind.ERROR) {
      handleLoading(acceptBookingStatut, null, null, acceptBookingRequestError);
    }
  }, [
    acceptBookingStatut,
    acceptBookingRequestError,
    handleLoading,
    sendEmailToClient,
  ]);

  // refuse booking request handling
  useEffect(() => {
    if (refuseBookingStatut === HTTPStateKind.PENDING) {
      handleLoading(refuseBookingStatut, null, null, null);
    } else if (refuseBookingStatut === HTTPStateKind.SUCCESS) {
      sendEmailToClient();
    } else if (refuseBookingStatut === HTTPStateKind.ERROR) {
      handleLoading(refuseBookingStatut, null, null, refuseBookingRequestError);
    }
  }, [
    refuseBookingStatut,
    handleLoading,
    refuseBookingRequestError,
    sendEmailToClient,
  ]);

  return (
    <>
      <Modal
        show={showModal.show}
        onHide={() => setShowModal(initialModalState)}
      >
        <>
          {showModal.booking ? (
            <form
              className={classes["message-form"]}
              onSubmit={handleBookingSubmit}
            >
              <h3>Message à joindre</h3>
              <textarea
                className={classes["message-form__textarea"]}
                rows={10}
                cols={25}
              />
              <div className="button-container">
                <button className="button">Envoyer</button>
                <button
                  className="button button--alt"
                  type="button"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : null}
          {showModal.isSorted ? <Sort onSortValidation={handleSort} /> : null}
        </>
      </Modal>
      <section>
        <div className={classes["bookings__title-container"]}>
          <h2 className={classes["bookings__title"]}>{`Liste demandes (${
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
        {fetchBookingsRequestStatut === HTTPStateKind.SUCCESS &&
          (bookingsList?.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
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
          ))}
      </section>
    </>
  );
};

export default AllBookings;
