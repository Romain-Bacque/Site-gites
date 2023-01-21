// hooks import
import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
// components import
import BookingCalendar from "../BookingCalendar";
// types import
import {
  AvailabilityProps,
  DateRequestData,
  DisabledDatesData,
  HandleDateClick,
} from "./types";
// other imports
import dayjs from "dayjs";
import {
  deleteDateRequest,
  postDateRequest,
  getDatesRequest,
} from "../../../lib/api";
import classes from "./style.module.css";
import { useAppDispatch } from "../../../hooks/use-store";
import { loadingActions } from "../../../store/loading";
import { HTTPStateKind } from "../../../global/types";

// variable & constante
let timer: NodeJS.Timeout;

// component
const Availability: React.FC<AvailabilityProps> = ({
  className,
  shelter: shelterId,
  onDateClick,
  onDateChoice,
}) => {
  const [showDoubleView, setShowDoubleView] = useState(false);
  const [disabledDates, setDisabledDates] = useState<DisabledDatesData>([]);
  const dispatch = useAppDispatch();
  const {
    sendHttpRequest: getDisabledDatesHttpRequest,
    statut: getDisabledDatesStatut,
    data: getDisabledDatesData,
    error: getDisabledDatesError,
  } = useHttp(getDatesRequest);
  const {
    sendHttpRequest: deleteDisabledDateHttpRequest,
    statut: deleteDisabledDatesStatut,
    data: deleteDisabledDatesData,
  } = useHttp(deleteDateRequest);
  const {
    sendHttpRequest: postDisabledDateHttpRequest,
    statut: postDisabledDatesStatut,
    data: postDisabledDatesData,
  } = useHttp(postDateRequest);

  const formatDate = (date: Date) => dayjs(date).format("YYYY, MM, DD");

  const handleDateClick: HandleDateClick = (selectedDate, disabledDates) => {
    if (onDateClick) return onDateClick(selectedDate);
    clearTimeout(timer);
    // timer to prevent spam click and make the server crash
    timer = setTimeout(() => {
      const disabledDatesThatMatchSelectedDate =
        disabledDates &&
        disabledDates.length > 0 &&
        disabledDates.filter(
          (disabledDate) =>
            formatDate(selectedDate) === formatDate(disabledDate.from) ||
            formatDate(selectedDate) === formatDate(disabledDate.to)
        );

      // 'isClientBooking' is set to true if some disabledDates are so because of client(s) booking
      const isClientBooking =
        disabledDatesThatMatchSelectedDate &&
        disabledDatesThatMatchSelectedDate.length > 0 &&
        disabledDatesThatMatchSelectedDate.some((bookedDate) => {
          return (
            (formatDate(selectedDate) === formatDate(bookedDate.from) ||
              formatDate(selectedDate) === formatDate(bookedDate.to)) &&
            bookedDate.email
          );
        });

      // We can't modify date statut (disable or enable) if it's a booked date
      if (!isClientBooking) {
        const data: DateRequestData = {
          shelterId,
          selectedDate,
        };

        if (
          !disabledDatesThatMatchSelectedDate ||
          disabledDatesThatMatchSelectedDate.length <= 0
        ) {
          postDisabledDateHttpRequest(data); // if selected date is enabled, then we disable it
        } else {
          deleteDisabledDateHttpRequest(data); // if selected date is disabled, then we enable it
        }
      }
    }, 500);
  };

  // change the number of calendars displayed as window size changes
  useEffect(() => {
    const handleShowDoubleView = () => {
      setShowDoubleView(window.innerWidth > 700 ? true : false);
    };

    handleShowDoubleView();

    window.addEventListener("resize", handleShowDoubleView);

    return () => {
      window.removeEventListener("resize", handleShowDoubleView);
    };
  }, []);

  // get all disabled dates at initialization
  useEffect(() => {
    getDisabledDatesHttpRequest(shelterId);
  }, []);

  useEffect(() => {
    if (
      getDisabledDatesStatut === HTTPStateKind.SUCCESS &&
      getDisabledDatesData
    ) {
      setDisabledDates(getDisabledDatesData);
    }
  }, [getDisabledDatesStatut]);

  useEffect(() => {
    if (
      postDisabledDatesStatut === HTTPStateKind.SUCCESS &&
      postDisabledDatesData
    ) {
      setDisabledDates(postDisabledDatesData);
    }
  }, [postDisabledDatesStatut]);

  useEffect(() => {
    if (
      deleteDisabledDatesStatut === HTTPStateKind.SUCCESS &&
      deleteDisabledDatesData
    ) {
      setDisabledDates(deleteDisabledDatesData);
    }
  }, [deleteDisabledDatesStatut]);

  // get disabled dates request loading handling
  useEffect(() => {
    if (getDisabledDatesStatut) {
      dispatch(loadingActions.setStatut(getDisabledDatesStatut));
      dispatch(
        loadingActions.setMessage({
          success: null,
          error: getDisabledDatesError,
        })
      );
    }
  }, [getDisabledDatesStatut]);

  return (
    <>
      {getDisabledDatesStatut === HTTPStateKind.SUCCESS && (
        <div className={`${classes.calendar} ${classes[className]}`}>
          <BookingCalendar
            disabledDates={disabledDates}
            isDoubleView={showDoubleView}
            onDateClick={handleDateClick}
            onDateChoice={onDateChoice}
          />
          <div className={classes["legend"]}>
            <span className={classes["legend__image"]} />
            <span className={classes["legend__title"]}>
              Non disponible/réservé
            </span>
          </div>
        </div>
      )}
      {getDisabledDatesStatut === HTTPStateKind.ERROR && (
        <p className="text-center">Le calendrier est indisponible.</p>
      )}
    </>
  );
};

export default Availability;
