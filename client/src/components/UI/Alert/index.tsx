import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "react-transition-group";
import { HTTPStateKind } from "../../../global/types";
import classes from "./style.module.css";

// interfaces
interface AlertProps {
  message: string | null;
  alert: HTTPStateKind | null;
  show: boolean;
  onAlertClose: () => void;
}

// variable & constante
let backgroundColorClass: string;

// component
const Alert: React.FC<AlertProps> = ({
  message,
  alert,
  show,
  onAlertClose,
}) => {
  switch (alert) {
    case HTTPStateKind.SUCCESS:
      backgroundColorClass = "alert--green";
      break;
    case HTTPStateKind.ERROR:
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
          <div
            className={`${classes.alert} ${classes[backgroundColorClass]} ${classes[displayClass]}`}
          >
            <span className={classes.alert__span}>{message}</span>
            <FontAwesomeIcon
              onClick={onAlertClose}
              className={classes.alert__close}
              icon={faClose}
            />
          </div>
        );
      }}
    </Transition>
  );
};

export default Alert;
