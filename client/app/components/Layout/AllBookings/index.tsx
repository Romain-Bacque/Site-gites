"use client";

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
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useHTTPState from "../../../hooks/use-http-state";
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Button from "../../UI/Button";
import MessageForm from "../../UI/MessageForm";

dayjs().format();

const initialModalState = {
  show: false,
  booking: false,
  isSorted: false,
};
const initialBookingRefState = { emailTemplate: null, decision: null };

const AllBookings: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<ModalState>(initialModalState);
  const [bookingsList, setBookingsList] = useState<BookingsList>([]);
  const bookingRef = useRef<BookingRef>(initialBookingRefState);
  const deleteBookingRef = useRef<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleHTTPState = useHTTPState();

  const {
    data: fetchBookingsRequestData,
    status: fetchBookingsRequestStatut,
    error: fetchBookingRequestError,
  } = useMyQuery({
    queryKey: ["bookings"],
    queryFn: bookingsGetRequest,
    initialData: bookings,
    staleTime: 30 * 1000, // aligné avec ISR (30 secondes)
  });

  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  const {
    mutate: bookingMutate,
    status: bookingStatus,
    error: bookingError,
  } = useMyMutation({
    queryKeys: ["bookings"],
    mutationFn: bookingDecisionRequest,
    onSuccessFn: (data) => {
      queryClient.setQueryData(["bookings"], (oldData: Booking[]) => {
        if (!oldData) return oldData;
        return oldData.map((booking) =>
          booking._id === data._id ? data : booking,
        );
      });
    },
    onErrorFn: (_err: unknown, message: string) => {
      handleHTTPState("error", message);
    },
  });

  const { mutate: deleteBookingMutate } = useMyMutation({
    queryKeys: ["bookings"],
    mutationFn: deleteBookingRequest,
    onSuccessFn: (data) => {
      queryClient.setQueryData(["bookings"], (oldData: Booking[]) => {
        if (!oldData) return oldData;
        return oldData.filter((booking) => booking._id !== data._id);
      });
    },
    onErrorFn: (_err: unknown, message: string) => {
      handleHTTPState("error", message);
    },
  });

  const handleBookingSubmit = useCallback(
    (message: string) => {
      setShowModal(initialModalState);

      if (bookingRef.current.emailTemplate && bookingRef.current.decision) {
        const id = bookingRef.current.emailTemplate.bookingId;
        const statutMessage =
          bookingRef.current.decision === "accepted"
            ? t("bookings.accepted")
            : t("bookings.refused");
        const data = {
          decision: bookingRef.current.decision,
          emailTemplate: { ...bookingRef.current.emailTemplate, statutMessage },
          message,
        };

        bookingMutate({ id, data });
      }
    },
    [bookingMutate, t],
  );

  const handleCancel = useCallback(() => {
    setShowModal(initialModalState);
  }, []);

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
    [],
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
          }
          return result;
        });

        setBookingsList(arrayToSort);
      }
      setShowModal(initialModalState);
    },
    [bookingsList],
  );

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fetchBookingsRequestData) setBookingsList(fetchBookingsRequestData);
  }, [fetchBookingsRequestData]);

  useEffect(() => {
    if (bookingStatus === "pending") handleHTTPState("pending");
    else if (bookingStatus === "success")
      handleHTTPState("success", t("bookings.updateSuccess"));
    else if (bookingStatus === "error") handleHTTPState("error", "");
  }, [bookingStatus, bookingError, handleHTTPState, t]);

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
        show={showModal.booking}
        onHide={() => setShowModal(initialModalState)}
      >
        {showModal.booking && (
          <MessageForm onSubmit={handleBookingSubmit} onCancel={handleCancel} />
        )}
      </Modal>

      <Modal
        show={showModal.isSorted}
        onHide={() => setShowModal(initialModalState)}
      >
        {showModal.isSorted && <Sort onSortValidation={handleSort} />}
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <div className={classes["delete-confirm"]} style={{ padding: "1rem" }}>
          <h3 style={{ marginBottom: "4rem", fontWeight: 600 }}>
            {t("bookings.deleteConfirm")}
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
              {t("common.cancel")}
            </Button>
            <Button fullWidth onClick={confirmDelete}>
              {t("common.delete")}
            </Button>
          </div>
        </div>
      </Modal>

      <section>
        <div className={classes["bookings__title-container"]}>
          <h2 className={classes["bookings__title"]}>
            {t("bookings.title", {
              count: bookingsList ? bookingsList.length : 0,
            })}
          </h2>
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
              {t("bookings.sort")}
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
            <p className="text-center">{t("bookings.empty")}</p>
          ))}
      </section>
    </>
  );
};

export default AllBookings;
