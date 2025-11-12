import { useState } from "react";
import { useHistory } from "react-router-dom";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import gite1_small from "../../../img/gite1_small.jpg";
import gite1_large from "../../../img/gite1_large.jpg";
import gite2_small from "../../../img/gite2_small.jpg";
import gite2_large from "../../../img/gite2_large.jpg";
import Alert from "../../UI/Alert";
import { AlertStatut } from "./types";
import { getActivities } from "../../../lib/api";
import Activities from "../Activities";
import { ArrowRightAlt } from "@mui/icons-material";
import Button from "../../UI/Button";
import { useMyQuery } from "hooks/use-query";

// variable & constantes
const initialState = {
  message: null,
  alert: null,
  show: false,
};

const Home: React.FC = () => {
  const history = useHistory();
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [showModal, setShowModal] = useState(false);

  // ✅ Remplacement du hook useHttp
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

  const renderDetailsButton = () => {
    const width = window.innerWidth;
    const size = width > 768 ? "lg" : width > 480 ? "md" : "sm";

    return (
      <Button fullWidth size={size} onClick={() => history.push("/gites")}>
        Voir les détails
      </Button>
    );
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
            <h1 className={classes["banner__site-title"]}>Gites Du Quer</h1>
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
      <section className={classes.gites}>
        <Card className={classes.gite}>
          <div
            onClick={() => history.push("/gites")}
            className={classes["gite__picture-container"]}
          >
            <img
              className={classes.gite__picture}
              srcSet={`${gite1_small} 573w, ${gite1_large} 2201w`}
              src={gite1_large}
              alt="Gite 1"
            />
          </div>
          <div className={classes["gite__text-container"]}>
            <div>
              <h3 className={classes.gite__name}>Gîte Jo</h3>
              <div>
                <p className={classes.gite__places}>
                  Nombre de places : <span className="bold">4 personnes</span>
                </p>
              </div>
            </div>
            <div>
              <p className={classes.gite__price}>
                Semaine à partir de
                <span className={classes["gite__price--amount"]}>440€</span>
              </p>
              {renderDetailsButton()}
            </div>
          </div>
        </Card>
        <Card className={classes.gite}>
          <div
            onClick={() => history.push("/gites")}
            className={classes["gite__picture-container"]}
          >
            <img
              className={classes.gite__picture}
              srcSet={`${gite2_small} 576w, ${gite2_large} 2201w`}
              src={gite2_large}
              alt="Gite 1"
            />
          </div>
          <div className={classes["gite__text-container"]}>
            <div>
              <h3 className={classes.gite__name}>Gîte Flo</h3>
              <div>
                <p className={classes.gite__places}>
                  Nombre de places : <span className="bold">4 personnes</span>
                </p>
              </div>
            </div>
            <div>
              <p className={classes.gite__price}>
                Semaine à partir de
                <span className={classes["gite__price--amount"]}>440€</span>
              </p>
              {renderDetailsButton()}
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Home;
