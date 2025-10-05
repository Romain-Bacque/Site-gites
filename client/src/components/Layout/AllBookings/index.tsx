// hooks import
import React, { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/use-http";
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
import { HTTPStateKind } from "../../../global/types";
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
import useHTTPState from "../../../hooks/use-http-state";
import Button from "../../UI/Button";

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
  const handleHTTPState = useHTTPState();

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
      handleHTTPState(
        HTTPStateKind.SUCCESS,
        "Modification enregistrée, un mail de confirmation vous a été envoyé."
      );
    } catch (err) {
      handleHTTPState(
        HTTPStateKind.ERROR,
        "Modification enregistrée, mais echec de l'envoi du mail de confirmation."
      );
    }
  }, [handleHTTPState, textareaValue]);

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
              result = new Date(a.from).valueOf() - new Date(b.from).valueOf(); // valueOf is used to convert a Date object to a number, the number of milliseconds since January 1, 1970
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
      handleHTTPState(
        fetchBookingsRequestStatut,
        fetchBookingRequestError ?? ""
      );
    }
  }, [fetchBookingsRequestStatut, fetchBookingRequestError, handleHTTPState]);

  // accept booking request handling
  // handle booking request (accept or refuse)
  useEffect(() => {
    const handleStatut = (statut: HTTPStateKind | null, error: string | null) => {
      if (!statut) return;
      if (statut === HTTPStateKind.PENDING) {
        handleHTTPState(HTTPStateKind.PENDING);
      } else if (statut === HTTPStateKind.SUCCESS) {
        sendEmailToClient();
      } else if (statut === HTTPStateKind.ERROR) {
        handleHTTPState(statut, error ?? "");
      }
    };

    handleStatut(acceptBookingStatut, acceptBookingRequestError);
    handleStatut(refuseBookingStatut, refuseBookingRequestError);
  }, [
    acceptBookingStatut,
    acceptBookingRequestError,
    refuseBookingStatut,
    refuseBookingRequestError,
    handleHTTPState,
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
                <Button type="submit">Envoyer</Button>
                <Button onClick={handleCancel}>Annuler</Button>
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
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal({
                  isSorted: true,
                  booking: false,
                  show: true,
                });
              }}
              icon={() => (
                <FontAwesomeIcon
                  className={classes["sort-button__icon"]}
                  icon={faSliders}
                />
              )}
            >
              Trier
            </Button>
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
