import { useEffect, useState } from "react";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import gite1_small from "../../../img/gite1_small.jpg";
import gite1_large from "../../../img/gite1_large.jpg";
import gite2_small from "../../../img/gite2_small.jpg";
import gite2_large from "../../../img/gite2_large.jpg";
import { Link } from "react-router-dom";
import Alert from "../../UI/Alert";
// types import
import { AlertStatut } from "./types";
import useHttp from "../../../hooks/use-http";
import { getActivities } from "../../../lib/api";
import Activities from "../Activities";
import Modal from "../../UI/Modal";
import LoaderAndAlert from "../../UI/LoaderAndAlert";
import { ArrowRightAlt } from "@mui/icons-material";
import Button from "../../UI/Button";
import { HTTPStateKind } from "../../../global/types";
import { useAppSelector } from "../../../hooks/use-store";
import useHTTPState from "../../../hooks/use-http-state";

// variable & constantes
const initialState = {
  message: null,
  alert: null,
  show: false,
};

let isFirstRender = true;

// component
const Home: React.FC = () => {
  const handleHTTPState = useHTTPState();
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [showModal, setShowModal] = useState(false);
  const {
    sendHttpRequest,
    data: activities,
    statut,
    error,
  } = useHttp(getActivities, "activities");

  const handleFetchActivities = () => {
    sendHttpRequest();
    setShowModal(true);
  };

  useEffect(() => {
    if (isAuth && isFirstRender) handleHTTPState(2);
    if (!isAuth) isFirstRender = true;
    else isFirstRender = false;
  }, [handleHTTPState, isAuth]);

  return (
    <>
      <LoaderAndAlert statut={statut} message={error ?? ""} />
      <Modal
        className={classes["activities-modal"]}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        {statut === HTTPStateKind.PENDING ? (
          <p className="text-center">Chargement des activités...</p>
        ) : (
          <Activities activities={activities} />
        )}
      </Modal>
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
          <Button
            size="lg"
            className={classes.banner__button}
            iconPosition="right"
            icon={ArrowRightAlt}
            onClick={handleFetchActivities}
          >
            Activités dans le Couserans
          </Button>
        </Card>
      </section>
      <section>
        <article className={classes.summary}>
          <strong className={classes.summary__label}>
            Venez découvrir nos gîtes...
          </strong>
          <p className={classes.summary__paragraphe}>
            Notre gîte est situé dans un petit hameau du Couserans, à 600 m
            d’altitude, sur un versant exposé plein sud et en lisière de forêt.
            Indépendant et sans vis-à-vis, il offre une belle vue sur la vallée
            et la rivière, et se trouve au centre de nombreuses activités de
            montagne : randonnées tous niveaux, station de ski et luge d’été de
            Guzet à 30 min, thermes d’Aulus-les-Bains, accrobranche,
            canoë-kayak, escalade, équitation, vélo… La région compte de
            nombreux marchés locaux, dont celui très typique de Saint-Girons, où
            vous pourrez découvrir et savourer les produits du terroir. En
            saison, profitez aussi des châtaignes, champignons et myrtilles
            sauvages. À 200 m, la rivière le Garbet est idéale pour la pêche à
            la truite. Une initiation peut être proposée sur réservation avec le
            propriétaire, moniteur guide de pêche diplômé (prestation
            indépendante de la location).
          </p>
        </article>
      </section>
      <section>
        <Card className={classes.gite}>
          <Link to="/gites">
            <img
              className={classes.gite__picture}
              srcSet={`${gite1_small} 573w, ${gite1_large} 2201w`}
              src={gite1_large}
              alt="Gite 1"
            />
            <div className={classes["gite-text-container"]}>
              <div>
                <h3 className={classes.gite__name}>Gîte Jo</h3>
                <div>
                  <p className={classes.gite__places}>
                    Nombre de places : <span className="bold">4 personnes</span>
                  </p>
                </div>
              </div>
              <p className={classes.gite__price}>
                à partir de
                <span className={classes["gite__price--amount"]}>200€</span>par
                nuit.
              </p>
            </div>
          </Link>
        </Card>
        <Card className={classes.gite}>
          <Link to="/gites">
            <img
              className={classes.gite__picture}
              srcSet={`${gite2_small} 576w, ${gite2_large} 2201w`}
              src={gite2_large}
              alt="Gite 1"
            />
            <div className={classes["gite-text-container"]}>
              <div>
                <h3 className={classes.gite__name}>Gîte Flo</h3>
                <div>
                  <p className={classes.gite__places}>
                    Nombre de places : <span className="bold">4 personnes</span>
                  </p>
                </div>
              </div>
              <p className={classes.gite__price}>
                à partir de
                <span className={classes["gite__price--amount"]}>200€</span>par
                nuit.
              </p>
            </div>
          </Link>
        </Card>
      </section>
    </>
  );
};

export default Home;
