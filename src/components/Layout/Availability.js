import dayjs from "dayjs";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import { deleteDateRequest, postDateRequest } from "../../lib/api";
import classes from "./Availability.module.css";
import Planning from "./Planning";

// component
const Availability = ({ shelter }) => {
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

  const formatDate = (date) => dayjs(date).format("YYYY, MM, DD");

  const handleDateClick = (date, disabledDates) => {
    const BookedDates = disabledDates?.filter((disabledDate) => {
      return (
        formatDate(date) === formatDate(disabledDate.from) ||
        formatDate(date) === formatDate(disabledDate.to)
      );
    });

    const isClientReservation = BookedDates?.some((disabledDate) => {
      return (
        formatDate(date) === formatDate(disabledDate.from) ||
        (formatDate(date) === formatDate(disabledDate.to) && disabledDate.email)
      );
    });

    if (!isClientReservation) {
      const data = {
        shelter,
        date,
      };

      if (!BookedDates.length) {
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
        deleteDisabledDatesStatut={deleteDisabledDatesStatut}
        postDisabledDatesStatut={postDisabledDatesStatut}
        shelter={shelter}
        doubleView={showDoubleView}
        onDateClick={handleDateClick}
        className="react-calendar--availability"
      />
    </div>
  );
};

export default Availability;
