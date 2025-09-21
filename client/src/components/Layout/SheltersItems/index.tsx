import { ReactNode, useState } from "react";

import classes from "./style.module.css";
import Booking from "../Booking";
import Rates from "../Rates";
import Slider from "../../UI/slider/Slider";
import Availability from "../Availability";

// types import
import { SheltersItemsProps, Tab, TabKind } from "./types";

// variable & contante
let formContent: ReactNode = null;

// component
const SheltersItems: React.FC<SheltersItemsProps> = ({
  shelterId,
  title,
  number,
}) => {
  const [shelterStatut, setShelterStatut] = useState<Tab[]>([
    { tab: null },
    { tab: null },
  ]);

  if (shelterStatut[number].tab === TabKind.BOOK) {
    formContent = <Booking shelterId={shelterId} />;
  } else if (shelterStatut[number].tab === TabKind.RATES) {
    formContent = <Rates shelterId={shelterId} />;
  } else if (shelterStatut[number].tab === TabKind.AVAILABILITY) {
    formContent = (
      <Availability className="calendar--availability" shelterId={shelterId} />
    );
  }

  const handleShelterTab = (value: TabKind) => {
    setShelterStatut((prevState) => {
      return prevState.map((item, index) => {
        if (index === number) {
          const tabValue = item.tab === value ? null : value;

          return (item = { tab: tabValue });
        } else {
          return item;
        }
      });
    });
  };

  return (
    <div className={classes.gite}>
      <div className={classes["gite__picture-container"]}>
        <h2 className={classes.gite__title}>{title}</h2>
        <Slider shelter={number} />
      </div>
      <div className={classes["gites__details"]}>
        <h3 className={classes["gites__capacité-titre"]}>Capacité</h3>
        <p className={classes["gites__capacité-texte"]}>4 personnes</p>
        <h3 className={classes["gites__surface-titre"]}>Surface</h3>
        <p className={classes["gites__surface-texte"]}>60 m2</p>
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
            shelterStatut[number].tab === TabKind.AVAILABILITY
              ? classes.active
              : ""
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
      {shelterStatut[number].tab !== null && formContent}
    </div>
  );
};

export default SheltersItems;
