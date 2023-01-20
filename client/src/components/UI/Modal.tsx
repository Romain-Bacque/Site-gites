import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import Transition from "react-transition-group/Transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// interfaces
interface ModalProps {
  onHide?: () => void;
  children: JSX.Element | JSX.Element[];
  show: boolean;
}
interface OverlayProps {
  onHide?: () => void;
  className: string;
  children: JSX.Element | JSX.Element[];
}

// component
const Modal: React.FC<ModalProps> = (props) => {
  const Backdrop: React.FC = () => {
    return <div className={classes.backdrop} onClick={props.onHide}></div>;
  };

  const Overlay: React.FC<OverlayProps> = (props) => {
    return (
      <div className={`${classes.modal} ${classes[props.className]}`}>
        <FontAwesomeIcon onClick={props.onHide} className={classes["close-button"]} icon={faClose} />
        {props.children}
      </div>
    );
  };

  const animationTiming = {
    enter: 500,
    exit: 0,
  };

  return (
    <Transition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={animationTiming}
    >
      <>
        {ReactDOM.createPortal(
          <Backdrop />,
          document.getElementById("backdrop-root") as HTMLDivElement
        )}
        {ReactDOM.createPortal(
          <Overlay onHide={props.onHide} className={"modal-opened"}>{props.children}</Overlay>,
          document.getElementById("overlay-root") as HTMLDivElement
        )}
      </>
    </Transition>
  );
};

export default Modal;
