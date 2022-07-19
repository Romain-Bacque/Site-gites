import classes from "./Rates.module.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import { ratesGetRequest, ratesPostRequest } from "../../lib/api";
import Loader from "./Loader";

let firstUse = true;
let ratesContent;

const Rates = () => {
  const [priceValues, sePriceValues] = useState({
    price1: 1,
    price2: 1,
    price3: 1,
  });
  const isAuth = useSelector((state) => state.auth.isAuthentificated);
  const {
    sendHttpRequest: getRatesHttpRequest,
    statut: getRatesStatut,
    data: ratesData,
  } = useHttp(ratesGetRequest);
  const { sendHttpRequest: postRatesHttpRequest, statut: postRatesStatut } =
    useHttp(ratesPostRequest);

  const formIsValid =
    !isNaN(priceValues.price1) &&
    !isNaN(priceValues.price2) &&
    !isNaN(priceValues.price3);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formIsValid) return;

    firstUse = false;

    const data = {
      price1: priceValues.price1,
      price2: priceValues.price2,
      price3: priceValues.price3,
    };

    postRatesHttpRequest(data);
  };

  const handleValueChange = (event) => {
    sePriceValues((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  };

  useEffect(() => {
    if (ratesData) {
      sePriceValues({
        price1: ratesData.price1,
        price2: ratesData.price2,
        price3: ratesData.price3,
      });
    }
  }, [ratesData]);

  useEffect(() => {
    getRatesHttpRequest();
  }, [getRatesHttpRequest]);

  if (!firstUse) {
    if (getRatesStatut === "send" || postRatesStatut === "send") {
      ratesContent = <Loader />;
    } else if (postRatesStatut === "success") {
      ratesContent = <span>Prix enregistrés avec succés !</span>;
    } else if (postRatesStatut === "error") {
      ratesContent = <span>Enregistrement des prix impossible.</span>;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {ratesContent}
      <div className={classes["gites__grid-container"]}>
        <p className={classes["gites__grid-items"]}>header1</p>
        <p className={classes["gites__grid-items"]}>header2</p>
        <p className={classes["gites__grid-items"]}>header3</p>
        <div className={classes["gites__grid-items"]}>
          <input
            className={classes["gites__input"]}
            value={priceValues.price1}
            id="price1"
            min="1"
            max="9999"
            onChange={handleValueChange}
            type="number"
            name="country"
            disabled={isAuth ? false : true}
            required
          />
          <span>€</span>
        </div>
        <div className={classes["gites__grid-items"]}>
          <input
            className={classes["gites__input"]}
            value={priceValues.price2}
            id="price2"
            min="1"
            max="9999"
            onChange={handleValueChange}
            type="number"
            name="country"
            disabled={isAuth ? false : true}
            required
          />
          <span>€</span>
        </div>
        <div className={classes["gites__grid-items"]}>
          <input
            className={classes["gites__input"]}
            value={priceValues.price3}
            id="price3"
            min="1"
            max="9999"
            onChange={handleValueChange}
            type="number"
            name="country"
            disabled={isAuth ? false : true}
            required
          />
          <span>€</span>
        </div>
      </div>
      {isAuth && <button>Modifier</button>}
    </form>
  );
};

export default Rates;
