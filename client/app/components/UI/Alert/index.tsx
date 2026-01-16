import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
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

// component
const Alert: React.FC<AlertProps> = ({
  message,
  alert,
  show,
  onAlertClose,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const backgroundColorClass = (() => {
    switch (alert) {
      case "success":
        return "alert--green";
      case "error":
        return "alert--red";
      default:
        return "alert--gray";
    }
  })();

  return (
    <Transition
      nodeRef={nodeRef}
      mountOnEnter
      unmountOnExit
      in={show}
      timeout={4000}
    >
      {(state) => {
        const displayClass = state === "exiting" ? "alert--hide" : "";

        return (
          <div
            ref={nodeRef}
            className={`${classes.alert} ${classes[backgroundColorClass]} ${classes[displayClass]}`}
            role="alert"
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
