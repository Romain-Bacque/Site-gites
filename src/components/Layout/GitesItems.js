import { useState } from "react";

import classes from "./GitesItems.module.css";
import CSSTransition from "react-transition-group/CSSTransition";
import Booking from "./Booking";
import Rates from "./Rates";
import Slider from "../UI/slider/Slider";
import Availability from "./Availability";

let formContent;

const GitesItems = ({ shelter }) => {
  const [giteStatut, setGiteStatut] = useState({
    0: { tab: null },
    1: { tab: null },
  });

  //Select content
  if (giteStatut[shelter].tab === 0) {
    formContent = <Booking shelter={shelter} />;
  } else if (giteStatut[shelter].tab === 1) {
    formContent = <Rates shelter={shelter} />;
  } else if (giteStatut[shelter].tab === 2) {
    formContent = <Availability shelter={shelter} />;
  }

  return (
    <>
      <div className={classes["gite__picture-container"]}>
        <h2 className={classes.gite__title}>
          {shelter === 0 ? "Gite Jo" : "Gite Flo"}
        </h2>
        <Slider shelter={shelter} />
      </div>
      <div className={classes["gites__details"]}>
        <h3 className={classes["gites__capacité-titre"]}>Capacité</h3>
        <p className={classes["gites__capacité-texte"]}>2 personnes</p>
        <h3 className={classes["gites__surface-titre"]}>Surface</h3>
        <p className={classes["gites__surface-texte"]}>17 m2</p>
        <h3 className={classes["gites__animaux-titre"]}>Animaux</h3>
        <p className={classes["gites__animaux-texte"]}>sous accord</p>
      </div>
      <div className={classes["gite__buttons-container"]}>
        <button
          className={`${giteStatut[shelter].tab === 0 ? classes.active : ""} ${
            classes["gite__button-tab"]
          }`}
          onClick={() => {
            setGiteStatut((prevState) => {
              return { ...prevState, [shelter]: { tab: 0 } };
            });
          }}
        >
          Réserver
        </button>
        <button
          className={`${giteStatut[shelter].tab === 1 ? classes.active : ""} ${
            classes["gite__button-tab"]
          }`}
          onClick={() => {
            setGiteStatut((prevState) => {
              return { ...prevState, [shelter]: { tab: 1 } };
            });
          }}
        >
          Tarifs
        </button>
        <button
          className={`${giteStatut[shelter].tab === 2 ? classes.active : ""} ${
            classes["gite__button-tab"]
          }`}
          onClick={() => {
            setGiteStatut((prevState) => {
              return { ...prevState, [shelter]: { tab: 2 } };
            });
          }}
        >
          Disponibilités
        </button>
      </div>
      <div className={classes["gite__content"]}>
        {giteStatut[shelter].tab === 0 && <div></div>}
        {giteStatut[shelter].tab === 1 && <div></div>}
        {giteStatut[shelter].tab === 2 && <div></div>}
      </div>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={giteStatut[shelter].tab !== null}
        timeout={300}
        classNames={classes["fade-content"]}
      >
        <div className={classes["gites__tab-container"]}>{formContent}</div>
      </CSSTransition>
    </>
  );
};

export default GitesItems;
