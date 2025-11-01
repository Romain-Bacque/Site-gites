import { useEffect, useState } from "react";
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
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
  getCSRF,
} from "../../../lib/api";
import classes from "./style.module.css";
import useHTTPState from "hooks/use-http-state";

// variable & constante
let timer: NodeJS.Timeout;

// component
const Availability: React.FC<AvailabilityProps> = ({
  className,
  shelterId,
  onDateClick,
  onDateChoice,
}) => {
  const handleHTTPState = useHTTPState();
  const [showDoubleView, setShowDoubleView] = useState(false);
  const [disabledDates, setDisabledDates] = useState<DisabledDatesData>([]);

  // fetch CSRF once on mount
  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  // fetch disabled dates (react-query will refetch when shelterId changes)
  const {
    data: getDisabledDatesData,
    status: getDisabledDatesStatus,
    error: getDisabledDatesError,
  } = useMyQuery<DisabledDatesData>({
    queryKey: ["disabledDates", shelterId],
    queryFn: () => getDatesRequest(shelterId),
  });

  // post mutation -> on success update local disabledDates
  const {
    mutate: postDisabledDateHttpRequest,
  } = useMyMutation<DateRequestData, DisabledDatesData>({
    mutationFn: postDateRequest,
    onSuccessFn: (data) => {
      if (data) setDisabledDates(data);
    },
  });

  // delete mutation -> on success update local disabledDates
  const {
    mutate: deleteDisabledDateHttpRequest,
  } = useMyMutation<DateRequestData, DisabledDatesData>({
    mutationFn: deleteDateRequest,
    onSuccessFn: (data) => {
      if (data) setDisabledDates(data);
    },
  });

  const formatDate = (date: Date) => dayjs(date).format("YYYY, MM, DD");

  const handleDateClick: HandleDateClick = (selectedDate, disabledDatesArg) => {
    if (onDateClick) return onDateClick(selectedDate);
    clearTimeout(timer);
    // timer to prevent spam click and make the server crash
    timer = setTimeout(() => {
      const disabledDatesThatMatchSelectedDate =
        disabledDatesArg &&
        disabledDatesArg.length > 0 &&
        disabledDatesArg.filter(
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

  // update local disabledDates when fetch succeeds
  useEffect(() => {
    if (getDisabledDatesStatus === "success" && getDisabledDatesData) {
      setDisabledDates(getDisabledDatesData);
    }
  }, [getDisabledDatesData, getDisabledDatesStatus]);

  // get disabled dates request loading handling
  useEffect(() => {
    if (getDisabledDatesError) {
      handleHTTPState("error", getDisabledDatesError?.message);
    } else {
      handleHTTPState(getDisabledDatesStatus);
    }
  }, [getDisabledDatesError, getDisabledDatesStatus, handleHTTPState]);

  return (
    <>
      {getDisabledDatesStatus === "success" && (
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
      {getDisabledDatesStatus === "error" && (
        <p className="text-center">Le calendrier est indisponible.</p>
      )}
    </>
  );
};

export default Availability;
