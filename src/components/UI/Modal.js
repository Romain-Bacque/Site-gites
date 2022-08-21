import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import Transition from "react-transition-group/Transition";

const Modal = (props) => {
  const Backdrop = () => {
    return <div className={classes.backdrop} onClick={props.onHide}></div>;
  };

  const Overlay = (props) => {
    return (
      <div className={`${classes.modal} ${classes[props.className]}`}>
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
          <Backdrop onClick={props.onHide} />,
          document.getElementById("backdrop-root")
        )}
        {ReactDOM.createPortal(
          <Overlay className={"modalOpen"}>{props.children}</Overlay>,
          document.getElementById("overlay-root")
        )}
      </>
    </Transition>
  );
};

export default Modal;
