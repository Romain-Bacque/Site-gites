import React, { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/use-http";

import {
  bookingsGetRequest,
  acceptBookingRequest,
  refuseBookingRequest,
} from "../../lib/api";
import Loader from "./Loader";
import classes from "./AllBookings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { emailHandler } from "../../lib/emailjs";
import Modal from "../UI/Modal";
import Sort from "./Sort";
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
import Alert from "../UI/Alert";

dayjs().format();

// variable & constante
const initialModalState = {
  show: false,
  booking: false,
  sort: false,
};
const initialMessageState = {
  message: "",
  alert: "",
  show: false,
};

// component
const AllBookings = () => {
  const [allBookingsContent, setAllBookingsContent] = useState();
  const [showModal, setShowModal] = useState(initialModalState);
  const [bookingsList, setBookingsList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [statutMessage, setStatutMessage] = useState(initialMessageState);

  const bookingRef = useRef({ value: null, bookingChoice: null });

  const {
    sendHttpRequest: bookingsHttpRequest,
    statut: bookingsRequestStatut,
    data,
  } = useHttp(bookingsGetRequest);
  const {
    sendHttpRequest: acceptBookingHttpRequest,
    statut: acceptBookingStatut,
  } = useHttp(acceptBookingRequest);
  const {
    sendHttpRequest: refuseBookingHttpRequest,
    statut: refuseBookingStatut,
  } = useHttp(refuseBookingRequest);

  const displayError = () => {
    setStatutMessage({
      message: "Une erreur est survenue",
      alert: "error",
      show: true,
    });
  };

  const handleBooking = useCallback(
    async (event) => {
      event.preventDefault();

      setShowLoader(true);
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
        setShowLoader(false);
        displayError();
      }

      if (bookingRef.current.bookingChoice === "accept") {
        acceptBookingHttpRequest(bookingRef.current.value.bookingId);
      } else refuseBookingHttpRequest(bookingRef.current.value.bookingId);
    },
    [acceptBookingHttpRequest, refuseBookingHttpRequest, textareaValue]
  );

  const handleCancel = () => {
    setTextareaValue("");
    setShowModal(initialModalState);
  };

  const handleEmailFormDisplay = useCallback((bookingChoice, data) => {
    bookingRef.current.value = data;
    bookingRef.current.bookingChoice = bookingChoice;

    setShowModal({
      sort: false,
      booking: true,
      show: true,
    });
  }, []);

  const handleRequestEnd = useCallback((statut) => {
    if (statut === "error") {
      displayError();
    }
    setShowLoader(false);
  }, []);

  const handleAllBookings = useCallback(
    (statut) => {
      if (statut === "success") {
        setAllBookingsContent(
          bookingsList?.length ? (
            <Swiper
              modules={[
                Navigation,
                Pagination,
                Scrollbar,
                A11y,
                EffectCoverflow,
              ]}
              loop="true"
              effect="coverflow"
              grabCursor="true"
              centeredSlides="true"
              spaceBetween={10}
              coverflowEffect={{
                rotate: 40,
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
              {bookingsList.map((booking) => (
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
                        <a href={`mailto:${booking.email}`}>{booking.email}</a>
                      </div>
                      <div className={classes["booking__date"]}>
                        Du {dayjs(booking.from).format("DD/MM/YYYY")}
                      </div>
                      <div className={classes["booking__date"]}>
                        Au {dayjs(booking.to).format("DD/MM/YYYY")}
                      </div>
                      <div className={classes["booking__informations"]}>
                        <div className={classes["booking__informations-title"]}>
                          Informations:
                        </div>
                        {booking.informations
                          ? booking.informations
                          : "Aucune information complémentaire."}
                      </div>

                      <div className={classes["booking__statut"]}>
                        <div>
                          Statut:
                          <span className={classes["booking__statut-content"]}>
                            {booking.booked === true ? "Réservé" : "En attente"}
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
        );
      }
    },
    [bookingsList, handleEmailFormDisplay]
  );

  const handleSort = useCallback(
    (sort) => {
      if (sort) {
        const arrayToSort = bookingsList;

        arrayToSort.sort((a, b) => {
          if (sort === "dateIncreasing") {
            return new Date(a.from) - new Date(b.from);
          } else if (sort === "dateDecreasing") {
            return new Date(b.from) - new Date(a.from);
          } else if (sort === "awaiting") {
            return a.booked - b.booked;
          } else if (sort === "booked") {
            return b.booked - a.booked;
          }
        });

        setBookingsList(arrayToSort);
        handleAllBookings();
      }
      setShowModal(initialModalState);
    },
    [bookingsList, handleAllBookings]
  );

  useEffect(() => {
    setBookingsList(data);
  }, [data]);

  useEffect(() => {
    bookingsHttpRequest();
  }, [bookingsHttpRequest, acceptBookingStatut, refuseBookingStatut]);

  useEffect(() => {
    if (acceptBookingStatut === "success") {
      setStatutMessage({
        message: "Demande accepté, verifiez votre mail de confirmation",
        alert: "success",
        show: true,
      });
    }
  }, [acceptBookingStatut]);

  useEffect(() => {
    if (refuseBookingStatut === "success") {
      setStatutMessage({
        message: "Demande refusé",
        alert: "information",
        show: true,
      });
    }
  }, [refuseBookingStatut]);

  useEffect(() => {
    let timer;

    if (statutMessage.show) {
      timer = setTimeout(() => {
        setStatutMessage((prevState) => ({ ...prevState, show: false }));
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [statutMessage.show]);

  return (
    <>
      <Modal
        show={showModal.show}
        onHide={() => {
          setShowModal(initialModalState);
        }}
      >
        {showModal.booking && (
          <form onSubmit={handleBooking}>
            <h3>Message à envoyer</h3>
            <textarea rows="10" cols="25"></textarea>
            <div>
              <button>Envoyer</button>
              <button type="button" onClick={handleCancel}>
                Annuler
              </button>
            </div>
            {showLoader && (
              <Loader
                statut={acceptBookingStatut}
                onRequestEnd={handleRequestEnd}
              />
            )}
          </form>
        )}
        {showModal.sort && <Sort onSortValidation={handleSort} />}
      </Modal>
      <Alert
        message={statutMessage.message}
        alert={statutMessage.alert}
        show={statutMessage.show}
      />
      <section>
        <Loader
          statut={bookingsRequestStatut}
          onRequestEnd={handleAllBookings}
          message={{
            success: null,
            error:
              "Une erreur est survenue! Impossible d'afficher la liste des demandes.",
          }}
        />
        <div className={classes["bookings__title-container"]}>
          <h2 className={classes["bookings__title"]}>{`Liste des demandes (${
            bookingsList ? bookingsList.length : "0"
          })`}</h2>
          {bookingsList?.length ? (
            <button
              onClick={() => {
                setShowModal({
                  sort: true,
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
        {allBookingsContent}
      </section>
    </>
  );
};

export default AllBookings;
