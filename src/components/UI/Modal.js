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
    enter: 600,
    exit: 1000,
  };

  return (
    <Transition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={animationTiming}
    >
      {(state) => {
        const modalClasses =
          state === "entering"
            ? "modalOpen"
            : state === "exiting"
            ? "modalClosed"
            : null;
        return (
          <>
            {ReactDOM.createPortal(
              <Backdrop onClick={props.onHide} />,
              document.getElementById("backdrop-root")
            )}
            {ReactDOM.createPortal(
              <Overlay className={modalClasses}>{props.children}</Overlay>,
              document.getElementById("overlay-root")
            )}
          </>
        );
      }}
    </Transition>
  );
};

export default Modal;
