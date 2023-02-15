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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useHttp from "../../../hooks/use-http";
import { getActivities } from "../../../lib/api";
import Activities from "../Activities";
import Modal from "../../UI/Modal";
import { HandleLoading, HTTPStateKind } from "../../../global/types";
import { useDispatch } from "react-redux";
import { loadingActions } from "../../../store/loading";

// variable & constantes
const initialState = {
  message: null,
  alert: null,
  show: false,
};

// component
const Home: React.FC = () => {
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [showModal, setShowModal] = useState(false);
  const {
    sendHttpRequest,
    data: activitiesList,
    statut,
    error,
  } = useHttp(getActivities);
  const dispatch = useDispatch();

  const handleLoading: HandleLoading = (statut, success, error) => {
    dispatch(loadingActions.setStatut(statut));
    dispatch(
      loadingActions.setMessage({
        success,
        error,
      })
    );
  };

  const handleActivities = () => {
    sendHttpRequest();
  };

  useEffect(() => {
    if (statut) {
      handleLoading(statut, null, error);
      if (statut === HTTPStateKind.SUCCESS) setShowModal(true);
    }
  }, [statut]);

  return (
    <>
      <Modal className={classes["activities-modal"]} show={showModal} onHide={() => setShowModal(false)}>
        <Activities activities={activitiesList} />
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
          <button
            className={`${classes.banner__button} ${classes.button}`}
            onClick={handleActivities}
          >
            Activités dans le Couserans
            <FontAwesomeIcon className="button__icon" icon={faArrowRight} />
          </button>
        </Card>
      </section>
      <section>
        <article className={classes.summary}>
          <strong className={classes.summary__label}>
            Venez découvrir nos gîtes...
          </strong>
          <p className={classes.summary__paragraphe}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci ac
            auctor augue mauris augue neque. Adipiscing diam donec adipiscing
            tristique risus nec feugiat in fermentum. Sapien nec sagittis
            aliquam malesuada bibendum arcu vitae. Semper viverra nam libero
            justo laoreet sit amet. Pellentesque pulvinar pellentesque habitant
            morbi tristique.
          </p>
        </article>
      </section>
      <section>
        <Card className={classes.gite}>
          <img
            className={classes.gite__picture}
            srcSet={`${gite1_small} 573w, ${gite1_large} 2201w`}
            src={gite1_large}
            alt="Gite Jo"
          />
          <div className={classes["gite-text-container"]}>
            <h3 className={classes.gite__name}>Gîte Jo</h3>
            <div>
              <p className={classes.gite__places}>
                Nombre de places: <span className="bold">4 personnes</span>
              </p>
            </div>
            <p className={classes.gite__price}>
              à partir de
              <span className={classes["gite__price--amount"]}>200€</span>par
              nuit.
            </p>
            <Link className={classes.button} to="/gites">
              plus de détails...
            </Link>
          </div>
        </Card>
        <Card className={classes.gite}>
          <img
            className={classes.gite__picture}
            srcSet={`${gite2_small} 576w, ${gite2_large} 2201w`}
            src={gite2_large}
            alt="Gite Flo"
          />
          <div className={classes["gite-text-container"]}>
            <h3 className={classes.gite__name}>Gîte Flo</h3>
            <div>
              <p className={classes.gite__places}>
                Nombre de places: <span className="bold">4 personnes</span>
              </p>
            </div>
            <p className={classes.gite__price}>
              à partir de
              <span className={classes["gite__price--amount"]}>200€</span>par
              nuit.
            </p>
            <Link className={classes.button} to="/gites">
              plus de détails...
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Home;
