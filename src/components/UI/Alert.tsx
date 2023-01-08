import { Transition } from "react-transition-group";
import classes from "./Alert.module.css";

// enums
export enum AlertKind {
  INFO,
  SUCCESS,
  ERROR,
}

// interfaces
interface AlertProps {
  message: string | null;
  alert: AlertKind | null;
  show: boolean;
}

// variable & constante
let backgroundColorClass: string;

// component
const Alert: React.FC<AlertProps> = ({ message, alert, show }) => {
  switch (alert) {
    case AlertKind.INFO:
      backgroundColorClass = "alert--gray";
      break;
    case AlertKind.SUCCESS:
      backgroundColorClass = "alert--green";
      break;
    case AlertKind.ERROR:
      backgroundColorClass = "alert--red";
      break;
    default:
      backgroundColorClass = "alert--gray";
  }

  return (
    <Transition mountOnEnter unmountOnExit in={show} timeout={4000}>
      {(state) => {
        const displayClass = state === "exiting" ? "alert--hide" : "";

        return (
          <span
            className={`${classes.alert} ${classes[backgroundColorClass]} ${classes[displayClass]}`}
          >
            {message}
          </span>
        );
      }}
    </Transition>
  );
};

export default Alert;
