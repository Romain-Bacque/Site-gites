import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import Alert from "../../UI/Alert";
import { AlertStatut } from "./types";
import { getActivities, getShelters } from "../../../lib/api";
import Activities from "../Activities";
import { ArrowRightAlt, ImageNotSupported } from "@mui/icons-material";
import Button from "../../UI/Button";
import { useMyQuery } from "hooks/use-query";
import useHTTPState from "hooks/use-http-state";
import { useTranslation } from "react-i18next"; // <-- import i18n

const initialState = {
  message: null,
  alert: null,
  show: false,
};

const Home: React.FC = () => {
  const { t } = useTranslation(); // <-- hook i18n
  const handleHTTPState = useHTTPState();
  const history = useHistory();
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [showModal, setShowModal] = useState(false);

  const {
    data: sheltersData,
    error: sheltersQueryError,
    isPending: sheltersIsPending,
  } = useMyQuery({
    queryKey: ["shelters"],
    queryFn: getShelters,
  });

  const {
    data: activities,
    status,
    refetch: fetchActivities,
  } = useMyQuery({
    queryFn: getActivities,
    queryKey: ["activities"],
    enabled: false,
  });

  const handleFetchActivities = () => {
    fetchActivities();
    setShowModal(true);
  };

  useEffect(() => {
    if (sheltersQueryError) {
      handleHTTPState("error", t("home.loadError"));
    }
  }, [status, activities, history, sheltersQueryError, handleHTTPState, t]);

  const renderDetailsButton = () => {
    const width = window.innerWidth;
    const size = width > 768 ? "lg" : width > 480 ? "md" : "sm";

    return (
      <Button
        icon={ArrowRightAlt}
        iconPosition="right"
        size={size}
        onClick={() => history.push("/gites")}
      >
        {t("home.seeDetails")}
      </Button>
    );
  };

  const renderShelters = () => {
    if (sheltersIsPending) {
      return <p>{t("home.loading")}</p>;
    } else if (sheltersData && sheltersData.length > 0) {
      return sheltersData.map((shelter) => (
        <Card key={shelter._id} className={classes.gite}>
          <div
            onClick={() => history.push(`/gites/${shelter._id}`)}
            className={classes["gite__picture-container"]}
          >
            {shelter.mainImage ? (
              <img
                className={classes.gite__picture}
                src={shelter.mainImage.url}
                alt={shelter.title}
              />
            ) : (
              <div className="text-center space">
                <ImageNotSupported sx={{ fontSize: "5rem", color: "#bbb" }} />
                <p>{t("home.noImage")}</p>
              </div>
            )}
          </div>
          <div className={classes["gite__text-container"]}>
            <div>
              <h3 className={classes.gite__name}>{shelter.title}</h3>
              <div>
                <p className={classes.gite__places}>
                  {t("home.capacity")}{" "}
                  <span className="bold">{t("home.people")}</span>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              {renderDetailsButton()}
            </div>
          </div>
        </Card>
      ));
    } else {
      return <p className="text-center">{t("home.noShelters")}</p>;
    }
  };

  return (
    <>
      <Activities
        httpStatut={status}
        onHide={() => setShowModal(false)}
        showModal={showModal}
        activities={activities}
      />

      <Alert
        message={alertStatut.message}
        alert={alertStatut.alert}
        show={alertStatut.show}
        onAlertClose={() =>
          setAlertStatut((prevState) => ({ ...prevState, show: false }))
        }
      />
      <section>
        <Card className={classes.banner}>
          <div className={classes["banner__site-branding"]}>
            <h1 className={classes["banner__site-title"]}>
              {t("home.bannerTitle")}
            </h1>
            <h2 className={classes["banner__site-description"]}>
              {t("home.bannerSubtitle")}
            </h2>
          </div>
        </Card>
      </section>
      <section>
        <article className={classes.summary}>
          <strong className={classes.summary__label}>
            {t("home.summaryLabel")}
          </strong>
          <p
            className={classes.summary__paragraphe}
            dangerouslySetInnerHTML={{ __html: t("home.summaryText") }}
          />
          <Button
            size="xl"
            className={classes.banner__button}
            iconPosition="right"
            icon={ArrowRightAlt}
            onClick={handleFetchActivities}
            variant="outline"
          >
            {t("home.activitiesButton")}
          </Button>
        </article>
      </section>
      <section className={classes.gites}>{renderShelters()}</section>
    </>
  );
};

export default Home;
