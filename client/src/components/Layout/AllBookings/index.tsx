import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../UI/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import BookingCard from "./BookingCard";
import {
  SortKind,
  BookingRef,
  BookingsList,
  HandleEmailModalDisplay,
  ModalState,
} from "./types";
import {
  bookingsGetRequest,
  getCSRF,
  bookingDecisionRequest,
  Booking,
  deleteBookingRequest,
} from "../../../lib/api";
import classes from "./style.module.css";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import Sort from "../Sort";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useHTTPState from "../../../hooks/use-http-state";
import Button from "../../UI/Button";

// New hooks
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
import MessageForm from "components/UI/MessageForm";
import { useQueryClient } from "@tanstack/react-query";

dayjs().format();

// variables & constantes
const initialModalState = {
  show: false,
  booking: false,
  isSorted: false,
};
const initialBookingRefState = { emailTemplate: null, decision: null };

// component
const AllBookings: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<ModalState>(initialModalState);
  const [bookingsList, setBookingsList] = useState<BookingsList>([]);
  const bookingRef = useRef<BookingRef>(initialBookingRefState);
  const deleteBookingRef = useRef<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleHTTPState = useHTTPState();

  // fetch bookings
  const {
    data: fetchBookingsRequestData,
    status: fetchBookingsRequestStatut,
    error: fetchBookingRequestError,
  } = useMyQuery({
    queryKey: ["bookings"],
    queryFn: bookingsGetRequest,
    refetchOnMount: "always",
  });

  // get CSRF
  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  // handle booking mutation
  const {
    mutate: bookingMutate,
    status: bookingStatus,
    error: bookingError,
  } = useMyMutation({
    queryKeys: ["bookings"],
    mutationFn: bookingDecisionRequest,
    onSuccessFn: (data) => {
      // update the cache
      queryClient.setQueryData(["bookings"], (oldData: Booking[]) => {
        if (!oldData) return oldData;
        return oldData.map((booking) => {
          if (booking._id === data._id) {
            return data;
          }
          return booking;
        });
      });
    },
    onErrorFn: (_err: any, message: string) => {
      handleHTTPState("error", message);
    },
  });
  const {
    mutate: deleteBookingMutate,
    status: deleteBookingStatus,
    error: deleteBookingError,
  } = useMyMutation({
    queryKeys: ["bookings"],
    mutationFn: deleteBookingRequest,
    onSuccessFn: (data) => {
      // update the cache
      queryClient.setQueryData(["bookings"], (oldData: Booking[]) => {
        if (!oldData) return oldData;
        // if delete returns the deleted booking, remove it from the list
        return oldData.filter((booking) => booking._id !== data._id);
      });
    },
    onErrorFn: (_err: any, message: string) => {
      handleHTTPState("error", message);
    },
  });

  const handleBookingSubmit = useCallback(
    (message: string) => {
      // Close modal
      setShowModal(initialModalState);

      if (bookingRef.current.emailTemplate && bookingRef.current.decision) {
        const id = bookingRef.current.emailTemplate.bookingId;
        const statutMessage =
          bookingRef.current.decision === "accepted"
            ? "acceptée"
            : "malheureusement refusée";
        const data = {
          decision: bookingRef.current.decision,
          emailTemplate: { ...bookingRef.current.emailTemplate, statutMessage },
          message,
        };

        bookingMutate({ id, data });
      }
    },
    [bookingMutate]
  );

  // Cancel handler
  const handleCancel = useCallback(() => {
    setShowModal(initialModalState);
  }, []);

  // Display the email form, then fill it out (optionnal) to send an email to the client
  const handleEmailModalDisplay: HandleEmailModalDisplay = useCallback(
    (decision, emailTemplate) => {
      bookingRef.current.emailTemplate = emailTemplate;
      bookingRef.current.decision = decision;
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
            case SortKind.STATUS:
              result = +b.status - +a.status;
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

  // Instead of mutating immediately, open a confirm-delete modal
  const handleBookingCard = useCallback((bookingId: string) => {
    deleteBookingRef.current = bookingId;
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    const id = deleteBookingRef.current;
    if (!id) return;
    deleteBookingMutate(id);
    deleteBookingRef.current = null;
    setShowDeleteModal(false);
  }, [deleteBookingMutate]);

  // refresh bookings list display on the screen
  useEffect(() => {
    if (fetchBookingsRequestData) setBookingsList(fetchBookingsRequestData);
  }, [fetchBookingsRequestData]);

  // map react-query mutation statuses to your HTTPStateKind and trigger email sending
  useEffect(() => {
    if (bookingStatus === "pending") {
      handleHTTPState("pending");
    } else if (bookingStatus === "success") {
      handleHTTPState(
        "success",
        "Statut de la réservation mis à jour avec succès."
      );
    } else if (bookingStatus === "error") {
      // extract messages from errors if present
      const message = bookingError ? "" : "";
      handleHTTPState("error", message);
    }
  }, [bookingStatus, bookingError, handleHTTPState]);

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
      {/* Modal dédié au MessageForm */}
      <Modal
        show={showModal.booking}
        onHide={() => setShowModal(initialModalState)}
      >
        {showModal.booking && (
          <MessageForm onSubmit={handleBookingSubmit} onCancel={handleCancel} />
        )}
      </Modal>

      {/* Modal dédié au tri */}
      <Modal
        show={showModal.isSorted}
        onHide={() => setShowModal(initialModalState)}
      >
        {showModal.isSorted && <Sort onSortValidation={handleSort} />}
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <div className={classes["delete-confirm"]} style={{ padding: "1rem" }}>
          <h3 style={{ marginBottom: "4rem", fontWeight: 600 }}>
            Êtes-vous sûr de vouloir supprimer cette carte ?
          </h3>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button fullWidth onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      <section>
        <div className={classes["bookings__title-container"]}>
          <h2 className={classes["bookings__title"]}>{`Liste demandes (${
            bookingsList ? bookingsList.length : "0"
          })`}</h2>
          {bookingsList?.length ? (
            <Button
              center={false}
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
                    onChoice={handleEmailModalDisplay}
                    onDelete={handleBookingCard}
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
