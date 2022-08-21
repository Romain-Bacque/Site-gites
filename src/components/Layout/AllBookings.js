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

const initialState = {
  show: false,
  acceptBooking: false,
  refuseBooking: false,
  sort: false,
};

const AllBookings = () => {
  const [allBookingsContent, setAllBookingsContent] = useState();
  const [showModal, setShowModal] = useState(initialState);
  const [bookingsList, setBookingsList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [statutMessage, setStatutMessage] = useState({
    message: null,
    alert: null,
    show: false,
  });

  const bookingRef = useRef();

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

  const handleAcceptBooking = useCallback(
    async (event) => {
      event.preventDefault();

      setShowLoader(true);
      try {
        const response = await emailHandler.sendEmail();

        if (response.status !== 200) throw new Error();
      } catch (err) {
        console.log(err);
        setShowModal(initialState);
        setShowLoader(false);
        displayError();
      }

      acceptBookingHttpRequest(bookingRef.current);
    },
    [acceptBookingHttpRequest]
  );

  const handleRefuseBooking = () => {
    refuseBookingHttpRequest(bookingRef.current);
  };

  const handleEmailFormDisplay = useCallback((bookingId) => {
    bookingRef.current = bookingId;

    setShowModal({
      sort: false,
      acceptBooking: true,
      refuseBooking: false,
      show: true,
    });
  }, []);

  const handleRefuseAlertDisplay = useCallback(
    (bookingId) => {
      bookingRef.current = bookingId;

      setShowModal({
        sort: false,
        acceptBooking: false,
        refuseBooking: true,
        show: true,
      });
    },
    [refuseBookingHttpRequest]
  );

  const handleRequestEnd = (statut) => {
    if (statut === "error") {
      displayError();
    }

    setShowModal(initialState);
    setShowLoader(false);
  };

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
                            handleEmailFormDisplay(booking._id);
                          }}
                        >
                          Accepter
                        </button>
                        <button
                          className={`${classes["booking__button"]} ${classes["booking__button--refuse"]}`}
                          onClick={() => {
                            handleRefuseAlertDisplay(booking._id);
                          }}
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                  {showLoader && (
                    <Loader
                      statut={acceptBookingStatut}
                      onRequestEnd={handleRequestEnd}
                    />
                  )}
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
    [bookingsList, handleAcceptBooking, handleRefuseAlertDisplay]
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
      setShowModal(initialState);
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
          setShowModal(initialState);
        }}
      >
        {showModal.acceptBooking && (
          <form onSubmit={handleAcceptBooking}>
            <h3>Message à envoyer</h3>
            <textarea rows="10" cols="25"></textarea>
            <div>
              <button>Envoyer</button>
              <button onClick={() => setShowModal(initialState)}>
                Annuler
              </button>
            </div>
          </form>
        )}
        {showModal.refuseBooking && (
          <div>
            <p>Etes-vous sûr de vouloir refuser cette réservation ?</p>
            <div>
              <button onClick={handleRefuseBooking}>Oui</button>
              <button onClick={() => setShowModal(initialState)}>
                Annuler
              </button>
            </div>
          </div>
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
              "Une erreur est survenue! Impossible d'afficher la liste des reservations en cours.",
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
                  acceptBooking: false,
                  refuseBooking: false,
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
