import Card from "../UI/Card";
import classes from "./Home.module.css";
import gite1_small from "../../img/gite1_small.jpg";
import gite1_large from "../../img/gite1_large.jpg";
import gite2_small from "../../img/gite2_small.jpg";
import gite2_large from "../../img/gite2_large.jpg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Alert from "../UI/Alert";

const initialState = {
  message: null,
  alert: null,
  show: false,
};

const Home = () => {
  const [statutMessage, setStatutMessage] = useState(initialState);
  const isAuth = useSelector((state) => state.auth.isAuthentificated);

  useEffect(() => {
    let timer;

    if (isAuth) {
      setStatutMessage({
        message: "Bienvenue !",
        alert: "success",
        show: true,
      });

      timer = setTimeout(() => {
        setStatutMessage((prevState) => ({ ...prevState, show: false }));
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isAuth]);

  return (
    <>
      <Alert
        message={statutMessage.message}
        alert={statutMessage.alert}
        show={statutMessage.show}
      />
      <section>
        <Card className={classes.banner}>
          <button className={`${classes.button} ${classes["button--alpha"]}`}>
            &gt; Rechercher
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
