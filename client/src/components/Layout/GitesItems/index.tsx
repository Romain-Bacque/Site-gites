import { useState } from "react";

import classes from "./style.module.css";
import CSSTransition from "react-transition-group/CSSTransition";
import Booking from "../Booking";
import Rates from "../Rates";
import Slider from "../../UI/slider/Slider";
import Availability from "../Availability";
// types import
import { GitesItemsProps, Tab } from "./types";

// variable & contante
let formContent: JSX.Element;

// component
const GitesItems: React.FC<GitesItemsProps> = ({
  shelterId: shelter,
  title,
  number,
}) => {
  const [shelterStatut, setShelterStatut] = useState<Tab[]>([
    { tab: null },
    { tab: null },
  ]);

  //Select content
  if (shelterStatut[number].tab === 0) {
    formContent = <Booking shelter={shelter} />;
  } else if (shelterStatut[number].tab === 1) {
    formContent = <Rates shelter={shelter} />;
  } else if (shelterStatut[number].tab === 2) {
    formContent = <Availability className="calendar--availability" shelter={shelter} />;
  }

  const handleShelterTab = (value: number) => {
    setShelterStatut((prevState) => {
      return prevState.map((item, index) =>
        index === number ? (item = { tab: value }) : item
      );
    });
  };

  return (
    <>
      <div className={classes["gite__picture-container"]}>
        <h2 className={classes.gite__title}>{title}</h2>
        <Slider shelter={number} />
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
          className={`${
            shelterStatut[number].tab === 0 ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={() => handleShelterTab(0)}
        >
          Réserver
        </button>
        <button
          className={`${
            shelterStatut[number].tab === 1 ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={() => handleShelterTab(1)}
        >
          Tarifs
        </button>
        <button
          className={`${
            shelterStatut[number].tab === 2 ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={() => handleShelterTab(2)}
        >
          Disponibilités
        </button>
      </div>
      <div className={classes["gite__content"]}>
        {shelterStatut[number].tab === 0 && <div></div>}
        {shelterStatut[number].tab === 1 && <div></div>}
        {shelterStatut[number].tab === 2 && <div></div>}
      </div>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={shelterStatut[number].tab !== null}
        timeout={300}
        classNames={classes["fade-content"]}
      >
        <div className={classes["gites__tab-container"]}>{formContent}</div>
      </CSSTransition>
    </>
  );
};

export default GitesItems;
