// Note: adjust the import path for useMyQuery / useMyMutation to wherever you placed the new hooks file.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../UI/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import BookingCard from "./BookingCard";
import {
  SortKind,
  BookingRef,
  BookingsList,
  handleEmailFormDisplay,
  ModalState,
} from "./types";
import { HTTPStateKind } from "../../../global/types";
import {
  bookingsGetRequest,
  acceptBookingRequest,
  refuseBookingRequest,
  getCSRF,
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

// New hooks
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";

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

  // fetch bookings
  const {
    data: fetchBookingsRequestData,
    status: fetchBookingsRequestStatut,
    error: fetchBookingRequestError,
  } = useMyQuery({
    queryKey: ["bookings"],
    queryFn: bookingsGetRequest,
  });

  // get CSRF
  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  // accept mutation
  const {
    mutate: acceptBookingMutate,
    status: acceptBookingStatus,
    error: acceptBookingError,
  } = useMyMutation({
    mutationFn: acceptBookingRequest,
    onSuccessFn: (data) => {
      setBookingsList(data);
    },
    onErrorFn: (_err: any, message: string) => {
      handleHTTPState("error", message);
    },
  });

  // refuse mutation
  const {
    mutate: refuseBookingMutate,
    status: refuseBookingStatus,
    error: refuseBookingError,
  } = useMyMutation({
    mutationFn: refuseBookingRequest,
    onSuccessFn: (data) => {
      setBookingsList(data);
    },
    onErrorFn: (_err: any, message: string) => {
      handleHTTPState("error", message);
    },
  });

  const handleBookingSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setShowModal(initialModalState);

      if (bookingRef.current.value) {
        const id = bookingRef.current.value.bookingId;
        if (bookingRef.current.bookingChoice === "accept") {
          acceptBookingMutate(id);
        } else {
          refuseBookingMutate(id);
        }
      }
    },
    [acceptBookingMutate, refuseBookingMutate]
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

    delete (template as any).bookingId;

    try {
      const response = await emailHandler.sendEmail(template);

      if (response.status !== 200) throw new Error();
      handleHTTPState(
        "success",
        "Modification enregistrée, un mail de confirmation vous a été envoyé."
      );
    } catch (err) {
      handleHTTPState(
        "error",
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
      bookingRef.current.value = data;
      bookingRef.current.bookingChoice = bookingChoice;
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
        const arrayToSort = [...bookingsList];

        arrayToSort.sort((a, b) => {
          let result = 0;

          switch (sort) {
            case SortKind.DATE_DECREASING:
              result = new Date(a.from).valueOf() - new Date(b.from).valueOf();
              break;
            case SortKind.DATE_INCREASING:
              result = new Date(b.from).valueOf() - new Date(a.from).valueOf();
              break;
            case SortKind.AWAITING:
              result = new Date(a.from).valueOf() - new Date(b.from).valueOf();
              break;
            case SortKind.BOOKED:
              result = +b.booked - +a.booked;
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

  // refresh bookings list display on the screen
  useEffect(() => {
    if (fetchBookingsRequestData) setBookingsList(fetchBookingsRequestData);
  }, [fetchBookingsRequestData]);

  // map react-query mutation statuses to your HTTPStateKind and trigger email sending
  useEffect(() => {
    if (
      acceptBookingStatus === "pending" ||
      refuseBookingStatus === "pending"
    ) {
      handleHTTPState("pending");
    } else if (
      acceptBookingStatus === "success" ||
      refuseBookingStatus === "success"
    ) {
      // on success, send email
      sendEmailToClient();
    } else if (
      acceptBookingStatus === "error" ||
      refuseBookingStatus === "error"
    ) {
      // extract messages from errors if present
      const message = acceptBookingError ?? refuseBookingError ? "" : "";
      handleHTTPState("error", message);
    }
  }, [
    acceptBookingStatus,
    refuseBookingStatus,
    acceptBookingError,
    refuseBookingError,
    handleHTTPState,
    sendEmailToClient,
  ]);

  // show fetch status messages
  useEffect(() => {
    const message = fetchBookingRequestError ? "" : "";
    const mapped =
      fetchBookingsRequestStatut === "pending"
        ? "pending"
        : fetchBookingsRequestStatut === "success"
        ? "success"
        : "error";
    handleHTTPState(mapped, message);
  }, [fetchBookingsRequestStatut, fetchBookingRequestError, handleHTTPState]);

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
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
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
        {fetchBookingsRequestStatut === "success" &&
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
