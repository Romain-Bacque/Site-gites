import { useState } from "react";

import classes from "./style.module.css";
import Booking from "../Booking";
import Rates from "../Rates";
import Slider from "../../UI/slider/Slider";
import Availability from "../Availability";
// types import
import { GitesItemsProps, Tab, TabKind } from "./types";
import { useAppDispatch } from "../../../hooks/use-store";
import { loadingActions } from "../../../store/loading";

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
  const dispatch = useAppDispatch();

  if (shelterStatut[number].tab === TabKind.BOOK) {
    formContent = <Booking shelter={shelter} />;
  } else if (shelterStatut[number].tab === TabKind.RATES) {
    formContent = <Rates shelter={shelter} />;
  } else if (shelterStatut[number].tab === TabKind.AVAILABILITY) {
    formContent = <Availability className="calendar--availability" shelter={shelter} />;
  }

  const handleShelterTab = (value: TabKind) => {
    dispatch(loadingActions.resetStore());
    setShelterStatut((prevState) => {
      return prevState.map((item, index) => {
        if (index === number) {
          const tabValue = item.tab === value ? null : value;

          return item = { tab: tabValue } 
        } else {
          return item;
        }
      }
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
            shelterStatut[number].tab === TabKind.BOOK ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={() => handleShelterTab(TabKind.BOOK)}
        >
          Réserver
        </button>
        <button
          className={`${
            shelterStatut[number].tab === TabKind.RATES ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={() => handleShelterTab(TabKind.RATES)}
        >
          Tarifs
        </button>
        <button
          className={`${
            shelterStatut[number].tab === TabKind.AVAILABILITY ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={() => handleShelterTab(TabKind.AVAILABILITY)}
        >
          Disponibilités
        </button>
      </div>
      <div className={classes["gite__content"]}>
        {shelterStatut[number].tab === TabKind.BOOK && <span />}
        {shelterStatut[number].tab === TabKind.RATES && <span />}
        {shelterStatut[number].tab === TabKind.AVAILABILITY && <span />}
      </div>
      {shelterStatut[number].tab !== null && <div className={classes["gites__tab-container"]}>{formContent}</div>}
    </>
  );
};

export default GitesItems;
