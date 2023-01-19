import { useEffect, useState } from "react";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";

import dayjs from "dayjs";
import {
  deleteDateRequest,
  DisabledDatesReturnData,
  postDateRequest,
  DateRequestData,
  getDatesRequest,
} from "../../../lib/api";
import classes from "./style.module.css";
import BookingCalendar from "../BookingCalendar";
// types import
import { AvailabilityProps, DisabledDatesData, HandleDateClick } from "./types";
import LoaderAndAlert from "../LoaderAndAlert";

// variable & constante
let timer: NodeJS.Timeout;

// component
const Availability: React.FC<AvailabilityProps> = ({ className, shelter: shelterId, onDateClick, onDateChoice }) => {
  const [loaderAndAlert, setLoaderAndAlert] = useState<JSX.Element | null>(
    null
  );
  const [showDoubleView, setShowDoubleView] = useState(false);
  const [isVisible, setIsVisible] = useState(false)
  const [disabledDates, setDisabledDates] = useState<DisabledDatesData>([])
  const {
    sendHttpRequest: getDisabledDatesHttpRequest,
    statut: getDisabledDatesStatut,
    data: getDisabledDatesData,
    error: getDisabledDatesError
  } = useHttp(getDatesRequest);
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

  const handleDateClick: HandleDateClick = (
    selectedDate,
    disabledDates
  ) => {
    if (onDateClick) return onDateClick(selectedDate);     
    clearTimeout(timer);
    timer = setTimeout(() => {      
      const disabledDatesThatMatchSelectedDate =
        disabledDates &&
        disabledDates.length > 0 &&
        disabledDates.filter((disabledDate) => (
            formatDate(selectedDate) === formatDate(disabledDate.from) ||
            formatDate(selectedDate) === formatDate(disabledDate.to)
          )
        );
    
        // 'isClientBooking' is set to true if some disabledDates are so because of client(s) booking
        const isClientBooking =
          disabledDatesThatMatchSelectedDate &&
          disabledDatesThatMatchSelectedDate.length > 0 &&
          disabledDatesThatMatchSelectedDate.some((bookedDate) => {
            return (
              (formatDate(selectedDate) === formatDate(bookedDate.from) ||
              formatDate(selectedDate) === formatDate(bookedDate.to)) && bookedDate.email
            );
          });
    
        // We can't modify date statut (disable or enable) if it's a booked date
        if (!isClientBooking) {
          const data: DateRequestData = {
            shelterId,
            selectedDate,
          };
    
          if (!disabledDatesThatMatchSelectedDate || disabledDatesThatMatchSelectedDate.length <= 0) {
            postDisabledDateHttpRequest(data); // if selected date is enabled, then we disable it
          } else {
            deleteDisabledDateHttpRequest(data); // if selected date is disabled, then we enable it
          }
        }
    }, 500);
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

  useEffect(() => {
    getDisabledDatesHttpRequest();
  }, []);

  useEffect(() => {
    if (getDisabledDatesStatut === HTTPStateKind.SUCCESS && getDisabledDatesData) {      
      setDisabledDates(getDisabledDatesData);
      setIsVisible(true);
    } 
  }, [getDisabledDatesStatut]);

  useEffect(() => {
    if (postDisabledDatesStatut === HTTPStateKind.SUCCESS && postDisabledDatesData) {      
      setDisabledDates(postDisabledDatesData);
      setIsVisible(true);
    } 
  }, [postDisabledDatesStatut]);

  useEffect(() => {
    if (deleteDisabledDatesStatut === HTTPStateKind.SUCCESS && deleteDisabledDatesData) { 
      setDisabledDates(deleteDisabledDatesData);
      setIsVisible(true);
    } 
  }, [deleteDisabledDatesStatut]);  

  // get disabled dates
  useEffect(() => {
    getDisabledDatesStatut &&
      setLoaderAndAlert(
        <LoaderAndAlert
          statut={getDisabledDatesStatut}
          message={{
            success: null,
            error: getDisabledDatesError,
          }}
        />
      );
  }, [getDisabledDatesStatut]);

  return (
    <>
    {loaderAndAlert}
    {getDisabledDatesStatut === HTTPStateKind.SUCCESS &&
      <div className={`${classes.calendar} ${classes[className]}`}>
          <BookingCalendar
            disabledDates={disabledDates}
            isDoubleView={showDoubleView}
            onDateClick={handleDateClick}
            onDateChoice={onDateChoice}
          />
          <div className={classes["legend"]}>
            <span className={classes["legend__image"]} />
            <span className={classes["legend__title"]}>Non disponible/réservé</span>
          </div>      
      </div>}
    {getDisabledDatesStatut === HTTPStateKind.ERROR && <span>Le calendrier est indisponible.</span>}
    </>
  );
};

export default Availability;
