import { ReactNode, useEffect, useState } from "react";

import classes from "./style.module.css";
import Booking from "../Booking";
import Rates from "../Rates";
import Slider from "../../UI/slider/Slider";
import Availability from "../Availability";

import { SheltersItemsProps, Tab, TabKind } from "./types";
import { ImageNotSupported } from "@mui/icons-material";
import Card from "../../UI/Card";
import { useAppSelector } from "../../../hooks/use-store";
import Button from "../../../components/UI/Button";
import Input from "../Input";
import { useMyMutation } from "../../../hooks/use-query";
import useHTTPState from "../../../hooks/use-http-state";
import {
  GetSheltersWithPicturesRequestResponseData,
  updateShelterDescriptionRequest,
} from "../../../lib/api";
import { useQueryClient } from "@tanstack/react-query";

let formContent: ReactNode = null;

const SheltersItems: React.FC<SheltersItemsProps> = ({
  shelterId,
  title,
  description,
  images,
}) => {
  const queryClient = useQueryClient();
  const [shelterStatut, setShelterStatut] = useState<Tab>({ tab: null });
  const [descriptionText, setDescriptionText] = useState(description || "");
  const isAuth = useAppSelector(({ auth }) => auth.isAuthentificated);
  const handleHTTPState = useHTTPState();

  // Mutation pour mettre à jour la description
  const {
    mutate: updateDescription,
    status: updateStatus,
    isPending,
  } = useMyMutation({
    queryKeys: ["sheltersWithPictures"],
    mutationFn: updateShelterDescriptionRequest,
    onSuccessFn: (data) => {
      const prevData = queryClient.getQueryData<
        GetSheltersWithPicturesRequestResponseData["sheltersData"]
      >(["sheltersWithPictures"]);

      if (prevData) {
        const updatedData = prevData.map((item) =>
          item._id === shelterId
            ? { ...item, description: data.description }
            : item
        );

        queryClient.setQueryData(["sheltersWithPictures"], updatedData);
      }
    },
  });

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
    setShelterStatut((prevState) => ({
      tab: prevState.tab === value ? null : value,
    }));
  };

  const submitDescriptionHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!isAuth) return;

    const updatedDescription = descriptionText.trim();

    if (!updatedDescription) return;

    updateDescription({ id: shelterId, description: updatedDescription });
  };

  const renderDescriptionContent = () => {
    if (isAuth) {
      return (
        <form onSubmit={submitDescriptionHandler}>
          <Input
            type="textarea"
            className={classes["gites__description-textarea"]}
            defaultValue={descriptionText}
            placeholder="Entrez la description du gîte ici..."
            rows={10}
            onChange={(e) => setDescriptionText(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            className={classes["gites__description-button"]}
            loading={isPending}
            disabled={descriptionText.trim().length === 0}
          >
            Enregistrer
          </Button>
        </form>
      );
    } else {
      return description ? (
        <p className={classes["gites__description-text"]}>{description}</p>
      ) : (
        <p className={classes["gites__description-text"]}>
          Aucune description disponible pour le moment.
        </p>
      );
    }
  };

  useEffect(() => {
    if (updateStatus === "error") {
      handleHTTPState(
        "error",
        "Erreur lors de la mise à jour de la description."
      );
    } else if (updateStatus === "success") {
      handleHTTPState("success", "Description mise à jour avec succès.");
    } else {
      handleHTTPState(updateStatus);
    }
  }, [updateStatus, handleHTTPState]);

  return (
    <Card className={classes.gite__card}>
      <h2 className={classes.gite__title}>{title}</h2>
      <div className={classes["gite__picture-container"]}>
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
        <p className={classes["gites__surface-texte"]}>50 m2</p>
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
