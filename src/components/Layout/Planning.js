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

dayjs().format();

const Planning = ({ shelter, className, onDateChoice, doubleView }) => {
  const isAuth = useSelector((state) => state.auth.isAuthentificated);
  const [showLoader, setShowLoader] = useState(false);
  const [planningContent, setPlanningContent] = useState(null);
  const [currentDay] = useState(new Date());
  const {
    sendHttpRequest: deleteDisabledDateHttpRequest,
    statut: updatedDisabledDatesStatut,
    data: updatedDisabledDatesData,
  } = useHttp(deleteDateRequest);
  const {
    sendHttpRequest: postDisabledDateHttpRequest,
    statut: updatedPostDisabledDatesStatut,
    data: updatedPostDisabledDatesData,
  } = useHttp(postDateRequest);
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

  const handleDateClick = useCallback(
    (date) => {
      const isDateDisabled = disabledDatesData?.some((disabledDate) => {
        return (
          formatDate(date) === formatDate(disabledDate.from) ||
          formatDate(date) === formatDate(disabledDate.to)
        );
      });

      const data = {
        shelter,
        date,
      };

      if (!isDateDisabled) {
        postDisabledDateHttpRequest(data);
      } else deleteDisabledDateHttpRequest(data);
    },
    [shelter, disabledDatesData, postDisabledDateHttpRequest]
  );

  const handleDisabledDateStyle = useCallback(
    (date) => {
      const isDisabled = disabledDatesData?.some((disabledDate) => {
        return (
          formatDate(date) === formatDate(disabledDate.from) ||
          formatDate(date) === formatDate(disabledDate.to)
        );
      });
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
              showDoubleView={doubleView}
              className={`${classes["react-calendar"]} ${classes[className]}`}
              minDate={new Date()}
              tileClassName={({ date }) => handleDisabledDateStyle(date)}
              onClickDay={(date) => isAuth && handleDateClick(date)}
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
      handleDateClick,
      onDateChoice,
      className,
      doubleView,
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
