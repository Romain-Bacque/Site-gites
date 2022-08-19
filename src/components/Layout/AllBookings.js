import React, { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import {
  bookingsGetRequest,
  acceptBookingRequest,
  refuseBookingRequest,
} from "../../lib/api";
import Loader from "./Loader";
import Card from "../UI/Card";
import classes from "./AllBookings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import Modal from "../UI/Modal";
import Sort from "./Sort";

dayjs().format();

const AllBookings = () => {
  const [allBookingsContent, setAllBookingsContent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [bookingsList, setBookingsList] = useState([]);

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

  useEffect(() => {
    setBookingsList(data);
  }, [data]);

  useEffect(() => {
    bookingsHttpRequest();
  }, [bookingsHttpRequest, acceptBookingStatut, refuseBookingStatut]);

  const handleAcceptBooking = useCallback(
    (bookingId) => {
      acceptBookingHttpRequest(bookingId);
    },
    [acceptBookingHttpRequest]
  );

  const handleRefuseBooking = useCallback(
    (bookingId) => {
      refuseBookingHttpRequest(bookingId);
    },
    [refuseBookingHttpRequest]
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
      setShowModal(false);
    },
    [bookingsList]
  );

  const handleAllBookings = useCallback(() => {
    setAllBookingsContent(
      bookingsList?.length ? (
        <ul className={classes["bookings__list"]}>
          {bookingsList.map((booking) => (
            <Card className={classes["booking"]} key={booking._id}>
              <li>
                <h3 className={classes["booking__title"]}>
                  {booking.shelter.title}
                </h3>
                <div className={classes["booking__container"]}>
                  <div className={classes["booking__user-datas"]}>
                    <div className={classes["booking__name"]}>
                      {booking.name}
                    </div>
                    <div className={classes["booking__contact"]}>
                      <FontAwesomeIcon icon={faPhone} />
                      <div>{booking.phone}</div>
                    </div>
                    <div className={classes["booking__contact"]}>
                      <FontAwesomeIcon icon={faEnvelope} />
                      <a href={`mailto:${booking.email}`}>{booking.email}</a>
                    </div>
                    <div className={classes["booking__date"]}>
                      Du {dayjs(booking.from).format("DD/MM/YYYY")}
                    </div>
                    <div className={classes["booking__date"]}>
                      Au {dayjs(booking.to).format("DD/MM/YYYY")}
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
                  <div className={classes["booking__informations"]}>
                    <div className={classes["booking__informations-title"]}>
                      Informations:
                    </div>
                    {booking.informations
                      ? booking.informations
                      : "Aucune information complémentaire."}
                  </div>
                </div>

                {!booking.booked && (
                  <div className={classes["booking__actions"]}>
                    <button
                      className={`${classes["booking__button"]} ${classes["booking__button--accept"]}`}
                      onClick={() => {
                        handleAcceptBooking(booking._id);
                      }}
                    >
                      Accepter
                    </button>
                    <button
                      className={`${classes["booking__button"]} ${classes["booking__button--refuse"]}`}
                      onClick={() => {
                        handleRefuseBooking(booking._id);
                      }}
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </li>
            </Card>
          ))}
        </ul>
      ) : (
        <p className="information message">
          Il n'y a actuellement aucune réservation.
        </p>
      )
    );
  }, [bookingsList, handleAcceptBooking, handleRefuseBooking]);

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Sort onSortValidation={handleSort} />
      </Modal>
      <section>
        <div className={classes["bookings__title-container"]}>
          <h2 className={classes["bookings__title"]}>{`Liste des demandes (${
            bookingsList ? bookingsList.length : "0"
          })`}</h2>
          {bookingsList?.length ? (
            <button
              onClick={() => {
                setShowModal(true);
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
        <Loader
          statut={bookingsRequestStatut}
          onSuccess={handleAllBookings}
          message={{
            success: null,
            error:
              "Une erreur est survenue! Impossible d'afficher la liste des reservations en cours.",
          }}
        />
        {allBookingsContent}
      </section>
    </>
  );
};

export default AllBookings;
