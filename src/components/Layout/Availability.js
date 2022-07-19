import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

import { disabledDatesRequest } from "../../lib/api";
import Calendar from "react-calendar";

import classes from "./Availability.module.css";
import "react-calendar/dist/Calendar.css";
import Loader from "./Loader";
import dayjs from "dayjs";

dayjs().format();

let availabilityContent;

const Availability = ({ onDateChoice }) => {
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
    availabilityContent = <Loader />;
  } else if (disabledDateStatut === "success" && disabledDatesData) {
    availabilityContent = (
      <Calendar
        className={classes["react-calendar"]}
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
  }

  return availabilityContent;
};

export default Availability;
