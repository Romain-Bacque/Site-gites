import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import gite1_small from "../../../img/gite1_small.jpg";
import gite1_large from "../../../img/gite1_large.jpg";
import gite2_small from "../../../img/gite2_small.jpg";
import gite2_large from "../../../img/gite2_large.jpg";
import Alert from "../../UI/Alert";
import { AlertStatut } from "./types";
import { getActivities, getShelters } from "../../../lib/api";
import Activities from "../Activities";
import { ArrowRightAlt, ImageNotSupported } from "@mui/icons-material";
import Button from "../../UI/Button";
import { useMyQuery } from "hooks/use-query";
import useHTTPState from "hooks/use-http-state";

// variable & constantes
const initialState = {
  message: null,
  alert: null,
  show: false,
};

const Home: React.FC = () => {
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
    fetchActivities(); // fetch des activités à la demande
    setShowModal(true);
  };

  useEffect(() => {
    if (sheltersQueryError) {
      handleHTTPState("error", "Impossible de charger les gîtes.");
    }
  }, [status, activities, history, sheltersQueryError, handleHTTPState]);

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
        Voir les détails
      </Button>
    );
  };

  const renderShelters = () => {
    if (sheltersIsPending) {
      return <p>Chargement des gîtes...</p>;
    } else if (sheltersData && sheltersData.length > 0) {
      return sheltersData && sheltersData.length > 0 ? (
        sheltersData.map((shelter) => (
          <Card key={shelter._id} className={classes.gite}>
            <div
              onClick={() => history.push(`/gites/${shelter._id}`)}
              className={classes["gite__picture-container"]}
            >
              {shelter.mainImage ? (
                <img
                  className={classes.gite__picture}
                  src={shelter.mainImage.url} // assuming your API returns a main image URL
                  alt={shelter.title}
                />
              ) : (
                <div className="text-center space">
                  <ImageNotSupported sx={{ fontSize: "5rem", color: "#bbb" }} />
                  <p>Aucune image pour le moment.</p>
                </div>
              )}
            </div>
            <div className={classes["gite__text-container"]}>
              <div>
                <h3 className={classes.gite__name}>{shelter.title}</h3>
                <div>
                  <p className={classes.gite__places}>
                    Nombre de places : <span className="bold">4 personnes</span>
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
        ))
      ) : (
        <p className="text-center">Aucun gîte disponible.</p>
      );
    } else {
      return <p className="text-center">Aucun gîte disponible.</p>;
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
            <h1 className={classes["banner__site-title"]}>Gîtes Du Quer</h1>
            <h2 className={classes["banner__site-description"]}>
              Une belle escapade dans le Couserans.
            </h2>
          </div>
        </Card>
      </section>
      <section>
        <article className={classes.summary}>
          <strong className={classes.summary__label}>
            Venez découvrir nos gîtes...
          </strong>
          <p className={classes.summary__paragraphe}>
            Au cœur du Couserans, à 600 m d’altitude, les Gîtes du Quer vous
            accueillent dans un petit hameau paisible exposé plein sud, en
            lisière de forêt, avec une vue sur la vallée et la rivière. Chaque
            gîte dispose de son espace privé, sans vis-à-vis, sur un grand
            terrain commun propice à la détente et aux moments partagés.
            <br />
            Idéalement situés, ils offrent un accès privilégié à de nombreuses
            activités de montagne : randonnées pour tous niveaux, station de ski
            de Guzet-Neige, thermes d’Aulus-les-Bains, parcours d’accrobranche,
            canoë-kayak, escalade, équitation ou encore balades à vélo... Les
            amateurs de nature apprécieront la richesse des environs, où les
            saisons se déclinent au rythme des châtaignes, champignons et
            myrtilles sauvages.
            <br />
            À deux pas des gîtes, la rivière du Garbet séduira les pêcheurs de
            truite ; sur réservation préalable, le propriétaire, moniteur guide
            de pêche diplômé d’État, propose des initiations ou des
            perfectionnements à la pêche de loisir (prestation indépendante de
            la location).
            <br />
            La région est également réputée pour ses marchés authentiques,
            notamment celui de Saint-Girons, haut en couleurs et en saveurs.
            <br />À 5 km, vous trouverez tous les commerces et services
            essentiels : bureau de poste, épicerie, boucherie,
            boulangerie-pâtisserie, presse, restaurants, médecin et pharmacie.
            <br />
            Les animaux sont acceptés sur accord préalable des propriétaires,
            afin que chacun profite pleinement du calme et du charme de ce coin
            préservé de l’Ariège.
          </p>
          <Button
            size="xl"
            className={classes.banner__button}
            iconPosition="right"
            icon={ArrowRightAlt}
            onClick={handleFetchActivities}
            variant="outline"
          >
            Activités dans le Couserans
          </Button>
        </article>
      </section>
      <section className={classes.gites}>{renderShelters()}</section>
    </>
  );
};

export default Home;
