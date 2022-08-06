import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import { disabledDatesRequest } from "../../lib/api";
import Calendar from "react-calendar";

import classes from "./Planning.module.css";
import "react-calendar/dist/Calendar.css";
import Loader from "./Loader";
import dayjs from "dayjs";

dayjs().format();

const Planning = ({ className, onDateChoice, doubleView }) => {
  const [planningContent, setPlanningContent] = useState(null);
  const [currentDay] = useState(new Date());

  const {
    sendHttpRequest: disabledDatesHttpRequest,
    statut: disabledDateStatut,
    data: disabledDatesData,
  } = useHttp(disabledDatesRequest);

  useEffect(() => {
    disabledDatesHttpRequest();
  }, [disabledDatesHttpRequest]);

  const handleDateChange = useCallback(
    (date) => {
      onDateChoice(date);
    },
    [onDateChoice]
  );

  const handleCalendarDisplay = useCallback(() => {
    setPlanningContent(
      <Calendar
        showDoubleView={doubleView}
        className={`${classes["react-calendar"]} ${classes[className]}`}
        minDate={new Date()}
        tileDisabled={({ date, view }) =>
          view === "month" &&
          disabledDatesData.some(
            (disabledDate) =>
              date >=
                new Date(dayjs(disabledDate.from).format("YYYY, MM, DD")) &&
              date <= new Date(dayjs(disabledDate.to).format("YYYY, MM, DD"))
          )
        }
        onChange={(date) => {
          if (onDateChoice) {
            handleDateChange(dayjs(date).format("YYYY-MM-DD"));
          }
        }}
        value={currentDay}
      />
    );
  }, [
    disabledDatesData,
    handleDateChange,
    onDateChoice,
    className,
    doubleView,
    currentDay,
  ]);

  return (
    <>
      <Loader
        statut={disabledDateStatut}
        onSuccess={handleCalendarDisplay}
        message={{
          success: null,
          error: "Le calendrier est malheureusement indisponible.",
        }}
      />
      {planningContent}
    </>
  );
};

export default Planning;
