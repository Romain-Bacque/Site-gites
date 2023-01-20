// hooks import
import { useCallback } from "react";
import { useAppSelector } from "../../../hooks/use-store";
// component import
import Calendar from "react-calendar";
// types import
import { PlanningProps } from "./types";
// other import
import classes from "./style.module.css";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

dayjs().format();

// component
const Planning: React.FC<PlanningProps> = ({
  onDateChoice,
  onDateClick,
  isDoubleView,
  disabledDates
}) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);

  const formatDate = (date: Date) => dayjs(date).format("YYYY, MM, DD");

  // this function handle the style of each date button on the calendar
  const handleDisabledDateStyle = useCallback(
    ({ date }: { date: Date }) => {
      let isDisabled = false;

      if (disabledDates && typeof disabledDates === "object") {
        isDisabled =
          disabledDates.some((disabledDate) => {
            return (
              formatDate(date) >= formatDate(disabledDate.from) &&
              formatDate(date) <= formatDate(disabledDate.to)
            );
          }) || date <= new Date(); // dates prior to today today are disabled
      }
      return isDisabled ? classes["disabled-date"] : "";
    },
    [disabledDates]
  );
  
    // this function handle disabled attribute (true or false) of each date button on the calendar
  const hasDisabledDates = ({ date }: { date: Date }) => {
    if (disabledDates && typeof disabledDates === "object") {
      return disabledDates.some((disabledDate) => {
        if (disabledDate.email || !isAuth) {
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

  // this function handle date click to change the date statut (diabled or enabled)
  const handleDateClick = (date: Date) => {
    if (isAuth && onDateClick && !onDateChoice) {
      onDateClick(date, disabledDates);
    }
  }

  // this function handle date chosen on the calendar, to be set in the input element
  const handleDateChange = useCallback(
    (date: Date) => {
      onDateChoice && onDateChoice(date);
    },
    [onDateChoice]
  );

  return (
      <Calendar
        showDoubleView={isDoubleView}
        className={classes["react-calendar"]}
        tileClassName={handleDisabledDateStyle}
        tileDisabled={hasDisabledDates}
        onClickDay={handleDateClick}
        onChange={handleDateChange}
        minDate={new Date()}
        value={new Date()}
      />     
  )

};

export default Planning;
