import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import { disabledDatesRequest } from "../../lib/api";
import Calendar from "react-calendar";

import classes from "./Planning.module.css";
import "react-calendar/dist/Calendar.css";
import Loader from "./Loader";
import dayjs from "dayjs";

dayjs().format();

let planningContent;

const Planning = ({ className, onDateChoice, doubleView }) => {
  const [currentDay] = useState(new Date());
  const [chosenDate, setChosenDate] = useState(null);

  const {
    sendHttpRequest: disabledDatesHttpRequest,
    statut: disabledDateStatut,
    data: disabledDatesData,
  } = useHttp(disabledDatesRequest);

  useEffect(() => {
    disabledDatesHttpRequest();
  }, [disabledDatesHttpRequest]);

  useEffect(() => {
    if (chosenDate) {
      onDateChoice(chosenDate);
    }
  }, [onDateChoice, chosenDate]);

  if (disabledDateStatut === "send") {
    planningContent = <Loader />;
  } else if (disabledDateStatut === "success" && disabledDatesData) {
    planningContent = (
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
          setChosenDate(dayjs(date).format("YYYY-MM-DD"));
        }}
        value={currentDay}
      />
    );
  } else if (disabledDateStatut === "error") {
    planningContent = <p>Le calendrier est malheureusement indisponible.</p>;
  }

  return planningContent;
};

export default Planning;
