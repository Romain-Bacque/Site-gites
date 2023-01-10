import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

import dayjs from "dayjs";
import {
  deleteDateRequest,
  DisabledDatesReturnData,
  postDateRequest,
} from "../../../lib/api";
import classes from "./style.module.css";
import Planning from "../Planning";
// types import
import { AvailabilityProps, DisabledDatesData } from "./types";

// component
const Availability: React.FC<AvailabilityProps> = ({ shelter }) => {
  const [showDoubleView, setShowDoubleView] = useState(false);
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

  const handleDateClick = (
    date: Date,
    disabledDates: DisabledDatesData | null
  ) => {
    const BookedDates =
      disabledDates &&
      disabledDates.length > 0 &&
      disabledDates.filter((disabledDate) => {
        return (
          formatDate(date) === formatDate(disabledDate.from) ||
          formatDate(date) === formatDate(disabledDate.to)
        );
      });

    const isClientReservation =
      BookedDates &&
      BookedDates.length > 0 &&
      BookedDates.some((disabledDate) => {
        return (
          formatDate(date) === formatDate(disabledDate.from) ||
          (formatDate(date) === formatDate(disabledDate.to) &&
            disabledDate.email)
        );
      });

    if (!isClientReservation) {
      const data = {
        shelter,
        date,
      };

      if (!BookedDates || !BookedDates.length) {
        postDisabledDateHttpRequest(data);
      } else {
        deleteDisabledDateHttpRequest(data.shelter);
      }
    }
  };

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

  return (
    <div className={classes.availability}>
      <Planning
        isDoubleView={showDoubleView}
        onDateClick={handleDateClick}
        className="react-calendar--availability"
      />
    </div>
  );
};

export default Availability;
