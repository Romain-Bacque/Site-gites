import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [shelterStatut, setShelterStatut] = useState<Tab>({ tab: null });
  const [descriptionText, setDescriptionText] = useState(description || "");
  const isAuth = useAppSelector(({ auth }) => auth.isAuthentificated);
  const handleHTTPState = useHTTPState();

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
            placeholder={t("sheltersItems.descriptionPlaceholder")}
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
            {t("common.save")}
          </Button>
        </form>
      );
    } else {
      return description ? (
        <p className={classes["gites__description-text"]}>{description}</p>
      ) : (
        <p className={classes["gites__description-text"]}>
          {t("sheltersItems.noDescription")}
        </p>
      );
    }
  };

  useEffect(() => {
    if (updateStatus === "error") {
      handleHTTPState("error", t("sheltersItems.updateError"));
    } else if (updateStatus === "success") {
      handleHTTPState("success", t("sheltersItems.updateSuccess"));
    } else {
      handleHTTPState(updateStatus);
    }
  }, [updateStatus, handleHTTPState, t]);

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
        <h3 className={classes["gites__capacité-titre"]}>
          {t("sheltersItems.capacity")}
        </h3>
        <p className={classes["gites__capacité-texte"]}>
          {t("sheltersItems.people", { number: 4 })}
        </p>

        <h3 className={classes["gites__surface-titre"]}>
          {t("sheltersItems.surface")}
        </h3>
        <p className={classes["gites__surface-texte"]}>50 m2</p>

        <h3 className={classes["gites__animaux-titre"]}>
          {t("sheltersItems.pets")}
        </h3>
        <p className={classes["gites__animaux-texte"]}>
          {t("sheltersItems.petsCondition")}
        </p>
      </div>

      <div className={classes["gites__description"]}>
        <h3 className={classes["gites__description-titre"]}>
          {t("sheltersItems.description")}
        </h3>
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
          {t("sheltersItems.book")}
        </button>

        <button
          type="button"
          className={`${
            shelterStatut.tab === TabKind.RATES ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={(event) => handleShelterTab(event, TabKind.RATES)}
        >
          {t("sheltersItems.rates")}
        </button>

        <button
          type="button"
          className={`${
            shelterStatut.tab === TabKind.AVAILABILITY ? classes.active : ""
          } ${classes["gite__button-tab"]}`}
          onClick={(event) => handleShelterTab(event, TabKind.AVAILABILITY)}
        >
          {t("sheltersItems.availability")}
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
