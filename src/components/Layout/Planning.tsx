import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import {
  getDatesRequest,
  postDateRequest,
  deleteDateRequest,
} from "../../lib/api";
import Calendar from "react-calendar";

import classes from "./Planning.module.css";
import "react-calendar/dist/Calendar.css";
import Loader from "./Loader";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

interface PlanningProps {
  className: string;
  onDateChoice: (date: Date) => void;
  onDateClick?: (date: Date, disabledDatesData: object[]) => void;
  isDoubleView?: boolean;
}

dayjs().format();

const Planning: React.FC<PlanningProps> = ({
  className,
  onDateChoice,
  onDateClick,
  isDoubleView,
}) => {
  const isAuth = useSelector((state) => state.auth.isAuthentificated);
  const [showLoader, setShowLoader] = useState(false);
  const [planningContent, setPlanningContent] = useState(null);
  const [currentDay] = useState(new Date());
  const {
    sendHttpRequest: disabledDatesHttpRequest,
    statut: disabledDatesStatut,
    data: disabledDatesData,
  } = useHttp(getDatesRequest);

  useEffect(() => {
    setShowLoader(true);
    disabledDatesHttpRequest();
  }, [disabledDatesHttpRequest]);

  const handleDateChange = useCallback(
    (date) => {
      onDateChoice(date);
    },
    [onDateChoice]
  );

  const formatDate = (date) => dayjs(date).format("YYYY, MM, DD");

  const handleDisabledDateStyle = useCallback(
    (date) => {
      const isDisabled =
        disabledDatesData?.some((disabledDate) => {
          return (
            formatDate(date) === formatDate(disabledDate.from) ||
            formatDate(date) === formatDate(disabledDate.to)
          );
        }) || date <= new Date();
      return isDisabled ? classes["disabled-date"] : null;
    },
    [disabledDatesData]
  );

  const handleCalendarDisplay = useCallback(
    (statut) => {
      if (statut === "success") {
        setShowLoader(false);
        setPlanningContent(
          <div className={classes["calendar-container"]}>
            <Calendar
              showDoubleView={isDoubleView}
              className={`${classes["react-calendar"]} ${classes[className]}`}
              minDate={new Date()}
              tileClassName={({ date }) => handleDisabledDateStyle(date)}
              tileDisabled={({ date, view }) =>
                view === "month" &&
                disabledDatesData.some(
                  (disabledDate) =>
                    disabledDate.email &&
                    formatDate(date) >= formatDate(disabledDate.from) &&
                    formatDate(date) <= formatDate(disabledDate.to)
                )
              }
              onClickDay={(date) =>
                isAuth && onDateClick && onDateClick(date, disabledDatesData)
              }
              onChange={(date) => onDateChoice && handleDateChange(date)}
              value={currentDay}
            />
            <div className={classes["legend"]}>
              <span className={classes["legend__image"]}></span>
              <span className={classes["legend__title"]}>Non disponible</span>
            </div>
          </div>
        );
      }
    },
    [
      handleDisabledDateStyle,
      handleDateChange,
      onDateClick,
      onDateChoice,
      className,
      isDoubleView,
      currentDay,
    ]
  );

  return (
    <>
      {showLoader && (
        <Loader
          statut={disabledDatesStatut}
          onRequestEnd={handleCalendarDisplay}
          message={{
            success: null,
            error: "Le calendrier est indisponible.",
          }}
        />
      )}
      {planningContent}
    </>
  );
};

export default Planning;
