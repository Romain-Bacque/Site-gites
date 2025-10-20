import { ReactNode, useEffect, useState } from "react";

import classes from "./style.module.css";
import Booking from "../Booking";
import Rates from "../Rates";
import Slider from "../../UI/slider/Slider";
import Availability from "../Availability";

// types import
import { SheltersItemsProps, Tab, TabKind } from "./types";
import { ImageNotSupported } from "@mui/icons-material";
import Card from "../../UI/Card";
import { useAppSelector } from "../../../hooks/use-store";
import Button from "../../../components/UI/Button";
import Input from "../Input";
import useHttp from "../../../hooks/use-http";
import useHTTPState from "../../../hooks/use-http-state";
import { updateShelterDescriptionRequest } from "../../../lib/api";

// variable & contante
let formContent: ReactNode = null;

// component
const SheltersItems: React.FC<SheltersItemsProps> = ({
  shelterId,
  title,
  description,
  images,
}) => {
  const [shelterStatut, setShelterStatut] = useState<Tab>({ tab: null });
  const [descriptionText, setDescriptionText] = useState<string>("");
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const handleHTTPState = useHTTPState();
  const {
    sendHttpRequest: updateShelterDescriptionHTTPRequest,
    data: updateShelterDescriptionData,
    statut: updateShelterDescriptionStatut,
    error: updateShelterDescriptionError,
  } = useHttp(updateShelterDescriptionRequest);

  const descriptionTextToShow = descriptionText || description || "";

  if (shelterStatut.tab === TabKind.BOOK) {
    formContent = <Booking shelterId={shelterId} />;
  } else if (shelterStatut.tab === TabKind.RATES) {
    formContent = <Rates shelterId={shelterId} />;
  } else if (shelterStatut.tab === TabKind.AVAILABILITY) {
    formContent = (
      <Availability className="calendar--availability" shelterId={shelterId} />
    );
  }

  const handleShelterTab = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: TabKind
  ) => {
    event.stopPropagation();

    setShelterStatut((prevState) => {
      if (prevState.tab === value) {
        return { tab: null };
      }
      return { tab: value };
    });
  };

  const handleDescriptionSave = (description: string) => {
    updateShelterDescriptionHTTPRequest({ id: shelterId, description });
  };

  const renderDescriptionContent = () => {
    if (isAuth) {
      return (
        <div>
          <Input
            type="textarea"
            className={classes["gites__description-textarea"]}
            defaultValue={descriptionTextToShow}
            placeholder="Entrez la description du gîte ici..."
            rows={7}
            onChange={(e) => setDescriptionText(e.target.value)}
          />
          <Button
            fullWidth
            onClick={() => handleDescriptionSave(descriptionText)}
            className={classes["gites__description-button"]}
            loading={updateShelterDescriptionStatut === 2}
          >
            Enregistrer
          </Button>
        </div>
      );
    } else {
      return description ? (
        <p className={classes["gites__description-texte"]}>{description}</p>
      ) : (
        <p className={classes["gites__description-texte"]}>
          Aucune description disponible pour le moment.
        </p>
      );
    }
  };

  useEffect(() => {
    if (!updateShelterDescriptionError) {
      handleHTTPState(updateShelterDescriptionStatut);
    } else {
      handleHTTPState(3, updateShelterDescriptionError);
    }
  }, [
    updateShelterDescriptionError,
    updateShelterDescriptionStatut,
    handleHTTPState,
  ]);

  return (
    <Card className={classes.gite__card}>
      <div className={classes["gite__picture-container"]}>
        <h2 className={classes.gite__title}>{title}</h2>
        {images?.length ? (
          <Slider title={title} data={images} />
        ) : (
          <div className="text-center space">
            <ImageNotSupported sx={{ fontSize: "5rem", color: "#bbb" }} />
          </div>
        )}
      </div>
      <div className={classes["gites__details"]}>
        <h3 className={classes["gites__capacité-titre"]}>Capacité</h3>
        <p className={classes["gites__capacité-texte"]}>4 personnes</p>
        <h3 className={classes["gites__surface-titre"]}>Surface</h3>
        <p className={classes["gites__surface-texte"]}>60 m2</p>
        <h3 className={classes["gites__animaux-titre"]}>Animaux</h3>
        <p className={classes["gites__animaux-texte"]}>sous accord</p>
      </div>
      <div className={classes["gites__description"]}>
        <h3 className={classes["gites__description-titre"]}>Description</h3>
        {renderDescriptionContent()}
      </div>
      <div className={classes["gite__buttons-container"]}>
        <button
          type="button"
          className={`${
            shelterStatut.tab === TabKind.BOOK ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={(event) => handleShelterTab(event, TabKind.BOOK)}
        >
          Réserver
        </button>
        <button
          type="button"
          className={`${
            shelterStatut.tab === TabKind.RATES ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={(event) => handleShelterTab(event, TabKind.RATES)}
        >
          Tarifs
        </button>
        <button
          type="button"
          className={`${
            shelterStatut.tab === TabKind.AVAILABILITY ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={(event) => handleShelterTab(event, TabKind.AVAILABILITY)}
        >
          Disponibilités
        </button>
      </div>
      <div className={classes["gite__content"]}>
        {shelterStatut.tab === TabKind.BOOK && <span />}
        {shelterStatut.tab === TabKind.RATES && <span />}
        {shelterStatut.tab === TabKind.AVAILABILITY && <span />}
      </div>
      {shelterStatut.tab !== null && formContent}
    </Card>
  );
};

export default SheltersItems;
