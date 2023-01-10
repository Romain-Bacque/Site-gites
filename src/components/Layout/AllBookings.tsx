import React, { useCallback, useEffect, useRef, useState } from "react";
import useHttp, { HTTPStateKind } from "../../hooks/use-http";

import {
  bookingsGetRequest,
  acceptBookingRequest,
  refuseBookingRequest,
  bookingRequestData,
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
import Sort, { SortKind } from "./Sort";
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
import Alert, { AlertKind } from "../UI/Alert";

dayjs().format();

// type aliases
type handleEmailFormDisplay = (
  bookingChoice: "accept" | "refuse",
  data: {
    bookingId: string;
    shelter: string;
    name: string;
    from: string;
    to: string;
  }
) => void;
type BookingsList = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  numberOfPerson: number;
  from: Date;
  to: Date;
  informations: string;
  booked: boolean;
  shelter_id: {
    title: string;
    number: number;
  };
}[];

// interfaces
interface StatutMessage {
  message: string;
  alert: null | AlertKind;
  show: boolean;
}
interface ModalState {
  show: boolean;
  booking: boolean;
  isSorted: boolean;
}
interface BookingData {
  bookingId: string;
  shelter: string;
  name: string;
  from: string;
  to: string;
}
interface BookingRef {
  value: BookingData | null;
  bookingChoice: "accept" | "refuse" | null;
}

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
  const [allBookingsContent, setAllBookingsContent] =
    useState<JSX.Element | null>(null);
  const [showModal, setShowModal] = useState<ModalState>(initialModalState);
  const [statutMessage, setStatutMessage] =
    useState<StatutMessage>(initialMessageState);
  const [bookingsList, setBookingsList] = useState<BookingsList>([]);
  const [showLoader, setShowLoader] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");

  const bookingRef = useRef<BookingRef>(initialBookingRefState);

  const {
    sendHttpRequest: bookingsHttpRequest,
    statut: bookingsRequestStatut,
    data: bookingsData,
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
      alert: AlertKind.ERROR,
      show: true,
    });
  };

  const handleBookingSubmit = useCallback(
    async (event: React.FormEvent) => {
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

  const handleRequestEnd = useCallback((statut: HTTPStateKind) => {
    if (statut === HTTPStateKind.ERROR) {
      displayError();
    }
    setShowLoader(false);
  }, []);

  const handleAllBookings = useCallback(
    (statut: HTTPStateKind) => {
      if (statut === HTTPStateKind.SUCCESS) {
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
              loop={true}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
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
        );
      }
    },
    [bookingsList, handleEmailFormDisplay]
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
    [bookingsList, handleAllBookings]
  );

  useEffect(() => {
    bookingsData && setBookingsList(bookingsData);
  }, [bookingsData]);

  useEffect(() => {
    bookingsHttpRequest();
  }, [bookingsHttpRequest, acceptBookingStatut, refuseBookingStatut]);

  useEffect(() => {
    if (acceptBookingStatut === HTTPStateKind.SUCCESS) {
      setStatutMessage({
        message: "Demande accepté, verifiez votre mail de confirmation",
        alert: AlertKind.SUCCESS,
        show: true,
      });
    }
  }, [acceptBookingStatut]);

  useEffect(() => {
    if (refuseBookingStatut === HTTPStateKind.SUCCESS) {
      setStatutMessage({
        message: "Demande refusé",
        alert: AlertKind.INFO,
        show: true,
      });
    }
  }, [refuseBookingStatut]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

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
        <>
          {showModal.booking ? (
            <form onSubmit={handleBookingSubmit}>
              <h3>Message à envoyer</h3>
              <textarea rows={10} cols={25}></textarea>
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
          ) : null}
          {showModal.isSorted ? <Sort onSortValidation={handleSort} /> : null}
        </>
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
        {allBookingsContent}
      </section>
    </>
  );
};

export default AllBookings;
