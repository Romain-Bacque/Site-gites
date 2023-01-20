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
import {
  faPhone,
  faEnvelope,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { emailHandler } from "../../../lib/emailjs";
import Modal from "../../UI/Modal";
import Sort from "../Sort";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectCoverflow,
} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
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
            case SortKind.DATE_INCREASING:
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
              console.log("an error was occured");
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
        success: "Demande accepté avec succés, verifiez votre mail de confirmation.",
        error: acceptBookingRequestError
      }))
    }
  }, [acceptBookingStatut])

  // refuse booking request loading statut
  useEffect(() => {
    if (refuseBookingStatut) {
      dispatch(loadingActions.setStatut(refuseBookingStatut))
      dispatch(loadingActions.setMessage({
        success: "Demande refusé avec succés.",
        error: refuseBookingRequestError
      }))
    }
  }, [refuseBookingStatut])

  return (
    <>
      <Modal
        show={showModal.show}
        onHide={() => {
          setShowModal(initialModalState);
        }}
      >
        <>
          {showModal.booking ? (
            <form onSubmit={handleBookingSubmit}>
              <h3>Message à envoyer</h3>
              <textarea rows={10} cols={25} />
              <div>
                <button>Envoyer</button>
                <button type="button" onClick={handleCancel}>
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
          bookingsList?.length ? (
            <Swiper
              modules={[
                Navigation,
                Pagination,
                Scrollbar,
                A11y,
                EffectCoverflow,
              ]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              spaceBetween={30}
              coverflowEffect={{
                rotate: 10,
                stretch: 0,
                depth: 25,
                modifier: 1,
                slideShadows: false,
              }}
              slidesPerView={2}
              navigation
              pagination={{ clickable: true }}
              className={classes.bookings__list}
            >
              {bookingsList.length > 0 &&
                bookingsList.map((booking) => (
                  <SwiperSlide className={classes.booking} key={booking._id}>
                    <h3 className={classes.booking__title}>
                      {booking.shelter_id.title}
                    </h3>
                    <div className={classes.booking__container}>
                      <div className={classes["booking__user-datas"]}>
                        <div className={classes.booking__name}>
                          {booking.name}
                        </div>
                        <div className={classes.booking__contact}>
                          <FontAwesomeIcon icon={faPhone} />
                          <div>{booking.phone}</div>
                        </div>
                        <div className={classes.booking__contact}>
                          <FontAwesomeIcon icon={faEnvelope} />
                          <a href={`mailto:${booking.email}`}>
                            {booking.email}
                          </a>
                        </div>
                        <div className={classes["booking__date"]}>
                          Du {dayjs(booking.from).format("DD/MM/YYYY")}
                        </div>
                        <div className={classes["booking__date"]}>
                          Au {dayjs(booking.to).format("DD/MM/YYYY")}
                        </div>
                        <div className={classes["booking__informations"]}>
                          <div
                            className={classes["booking__informations-title"]}
                          >
                            Informations:
                          </div>
                          {booking.informations
                            ? booking.informations
                            : "Aucune information complémentaire."}
                        </div>

                        <div className={classes["booking__statut"]}>
                          <div>
                            Statut:
                            <span
                              className={classes["booking__statut-content"]}
                            >
                              {booking.booked === true
                                ? "Réservé"
                                : "En attente"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!booking.booked && (
                        <div className={classes["booking__actions"]}>
                          <button
                            className={`${classes["booking__button"]} ${classes["booking__button--accept"]}`}
                            onClick={() => {
                              handleEmailFormDisplay("accept", {
                                bookingId: booking._id,
                                shelter: booking.shelter_id.title,
                                name: booking.name,
                                from: dayjs(booking.from).format("DD/MM/YYYY"),
                                to: dayjs(booking.to).format("DD/MM/YYYY"),
                              });
                            }}
                          >
                            Accepter
                          </button>
                          <button
                            className={`${classes["booking__button"]} ${classes["booking__button--refuse"]}`}
                            onClick={() => {
                              handleEmailFormDisplay("refuse", {
                                bookingId: booking._id,
                                shelter: booking.shelter_id.title,
                                name: booking.name,
                                from: dayjs(booking.from).format("DD/MM/YYYY"),
                                to: dayjs(booking.to).format("DD/MM/YYYY"),
                              });
                            }}
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          ) : (
            <p className="information message">
              Il n'y a actuellement aucune réservation.
            </p>
          )   
        )}
      </section>
    </>
  );
};

export default AllBookings;
