import { Transition } from "react-transition-group";
import classes from "./Alert.module.css";

let backgroundColorClass;

const Alert = ({ message, alert, show }) => {
  switch (alert) {
    case "information":
      backgroundColorClass = "alert--gray";
      break;

    case "success":
      backgroundColorClass = "alert--green";
      break;

    case "error":
      backgroundColorClass = "alert--red";
      break;

    default:
      backgroundColorClass = "alert--gray";
  }

  return (
    <Transition mountOnEnter unmountOnExit in={show} timeout={4000}>
      {(state) => {
        const displayClass = state === "exiting" ? "alert--hide" : null;

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
