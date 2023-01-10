import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/use-store";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";

import {
  getDatesRequest,
  postDateRequest,
  deleteDateRequest,
  DisabledDatesReturnData,
} from "../../../lib/api";
import Calendar from "react-calendar";
import classes from "./style.module.css";
import "react-calendar/dist/Calendar.css";
import Loader from "../Loader";
import dayjs from "dayjs";
// types import
import { PlanningProps } from "./types";

dayjs().format();

// component
const Planning: React.FC<PlanningProps> = ({
  className,
  onDateChoice,
  onDateClick,
  isDoubleView,
}) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const [showLoader, setShowLoader] = useState(false);
  const [planningContent, setPlanningContent] = useState<JSX.Element | null>(
    null
  );
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
    (date: Date) => {
      onDateChoice && onDateChoice(date);
    },
    [onDateChoice]
  );

  const formatDate = (date: Date) => dayjs(date).format("YYYY, MM, DD");

  const handleDisabledDateStyle = useCallback(
    (date: Date) => {
      let isDisabled = false;

      if (typeof disabledDatesData === "object") {
        isDisabled =
          disabledDatesData?.some((disabledDate) => {
            return (
              formatDate(date) === formatDate(disabledDate.from) ||
              formatDate(date) === formatDate(disabledDate.to)
            );
          }) || date <= new Date();
      }
      return isDisabled ? classes["disabled-date"] : null;
    },
    [disabledDatesData]
  );

  const hasDisabledDates = (date: Date) => {
    if (disabledDatesData && typeof disabledDatesData === "object") {
      return disabledDatesData.some((disabledDate) => {
        if (disabledDate.email) {
          return (
            formatDate(date) >= formatDate(disabledDate.from) &&
            formatDate(date) <= formatDate(disabledDate.to)
          );
        }
        return false;
      });
    }
    return false;
  };

  const handleCalendarDisplay = useCallback(
    (statut: HTTPStateKind) => {
      if (statut === HTTPStateKind.SUCCESS) {
        setShowLoader(false);
        setPlanningContent(
          <div className={classes["calendar-container"]}>
            <Calendar
              showDoubleView={isDoubleView}
              className={`${classes["react-calendar"]} ${classes[className]}`}
              minDate={new Date()}
              tileClassName={({ date }) => handleDisabledDateStyle(date)}
              tileDisabled={({ date, view }) =>
                view === "month" && hasDisabledDates(date)
              }
              onClickDay={(date) =>
                isAuth && onDateClick && onDateClick(date, disabledDatesData)
              }
              onChange={(date: Date) => onDateChoice && handleDateChange(date)}
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