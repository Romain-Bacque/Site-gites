import { useEffect, useState } from "react";
import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
import { useTranslation } from "react-i18next"; // ✅ import
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

const Availability: React.FC<AvailabilityProps> = ({
  className,
  shelterId,
  onDateClick,
  onDateChoice,
}) => {
  const { t } = useTranslation(); // ✅ hook i18next
  const handleHTTPState = useHTTPState();
  const [showDoubleView, setShowDoubleView] = useState(false);
  const [disabledDates, setDisabledDates] = useState<DisabledDatesData>([]);

  useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  const {
    data: getDisabledDatesData,
    status: getDisabledDatesStatus,
    error: getDisabledDatesError,
  } = useMyQuery<DisabledDatesData>({
    queryKey: ["disabledDates", shelterId],
    queryFn: () => getDatesRequest(shelterId),
  });

  const { mutate: postDisabledDateHttpRequest } = useMyMutation<
    DateRequestData,
    DisabledDatesData
  >({
    mutationFn: postDateRequest,
    onSuccessFn: (data) => {
      if (data) setDisabledDates(data);
    },
  });

  const { mutate: deleteDisabledDateHttpRequest } = useMyMutation<
    DateRequestData,
    DisabledDatesData
  >({
    mutationFn: deleteDateRequest,
    onSuccessFn: (data) => {
      if (data) setDisabledDates(data);
    },
  });

  const formatDate = (date: Date) => dayjs(date).format("YYYY, MM, DD");

  const handleDateClick: HandleDateClick = (selectedDate, disabledDatesArg) => {
    if (onDateClick) return onDateClick(selectedDate);
    clearTimeout(timer);
    timer = setTimeout(() => {
      const disabledDatesThatMatchSelectedDate =
        disabledDatesArg?.filter(
          (disabledDate) =>
            formatDate(selectedDate) === formatDate(disabledDate.from) ||
            formatDate(selectedDate) === formatDate(disabledDate.to)
        ) ?? [];

      const isClientBooking = disabledDatesThatMatchSelectedDate.some(
        (bookedDate) =>
          (formatDate(selectedDate) === formatDate(bookedDate.from) ||
            formatDate(selectedDate) === formatDate(bookedDate.to)) &&
          bookedDate.email
      );

      if (!isClientBooking) {
        const data: DateRequestData = { shelterId, selectedDate };
        if (disabledDatesThatMatchSelectedDate.length === 0) {
          postDisabledDateHttpRequest(data);
        } else {
          deleteDisabledDateHttpRequest(data);
        }
      }
    }, 500);
  };

  useEffect(() => {
    const handleShowDoubleView = () => {
      setShowDoubleView(window.innerWidth > 700);
    };

    handleShowDoubleView();
    window.addEventListener("resize", handleShowDoubleView);
    return () => window.removeEventListener("resize", handleShowDoubleView);
  }, []);

  useEffect(() => {
    if (getDisabledDatesStatus === "success" && getDisabledDatesData) {
      setDisabledDates(getDisabledDatesData);
    }
  }, [getDisabledDatesData, getDisabledDatesStatus]);

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
              {t("availability.notAvailable")}
            </span>
          </div>
        </div>
      )}
      {getDisabledDatesStatus === "error" && (
        <p className="text-center">{t("availability.calendarUnavailable")}</p>
      )}
    </>
  );
};

export default Availability;
