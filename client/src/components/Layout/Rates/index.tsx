import { useCallback, useEffect, useState } from "react";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";

import { ratesGetRequest, ratesPostRequest } from "../../../lib/api";
import Loader from "../LoaderAndAlert";
import Alert, { AlertKind } from "../../UI/Alert";
import classes from "./style.module.css";
import { useAppSelector } from "../../../hooks/use-store";
// types import
import { PriceValues, RatesProps, AlertStatut } from "./types";

// variable & constante
const initialState = {
  message: null,
  alert: null,
  show: false,
};

// component
const Rates: React.FC<RatesProps> = ({ shelter }) => {
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [showLoader, setShowLoader] = useState(false);
  const [priceValues, sePriceValues] = useState<PriceValues>({
    price1: 1,
    price2: 1,
    price3: 1,
  });
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const { sendHttpRequest: getRatesHttpRequest, data: ratesData } =
    useHttp(ratesGetRequest);
  const { sendHttpRequest: postRatesHttpRequest, statut: postRatesStatut } =
    useHttp(ratesPostRequest);

  const formIsValid =
    !isNaN(priceValues.price1) &&
    !isNaN(priceValues.price2) &&
    !isNaN(priceValues.price3);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formIsValid) return;

    const data = {
      price1: priceValues.price1,
      price2: priceValues.price2,
      price3: priceValues.price3,
      shelter,
    };

    postRatesHttpRequest(data);
    setShowLoader(true);
  };

  const handleValueChange = (event: React.ChangeEvent) => {
    sePriceValues((prevState) => {
      return {
        ...prevState,
        [event.target.id]: (event.target as HTMLInputElement).value,
      };
    });
  };

  const handleServerResponse = useCallback((statut: HTTPStateKind) => {
    if (statut === HTTPStateKind.SUCCESS) {
      setAlertStatut({
        message: "Prix enregistrés avec succés.",
        alert: AlertKind.INFO,
        show: true,
      });
    } else
      setAlertStatut({
        message: "Enregistrement des prix impossible.",
        alert: AlertKind.ERROR,
        show: true,
      });
    setShowLoader(false);
  }, []);

  useEffect(() => {
    if (ratesData && typeof ratesData === "object") {
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

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (alertStatut.show) {
      timer = setTimeout(() => {
        setAlertStatut((prevState) => ({ ...prevState, show: false }));
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [alertStatut.show]);

  return (
    <>
      <Alert
        message={alertStatut.message}
        alert={alertStatut.alert}
        show={alertStatut.show}
        onAlertClose={() =>
          setAlertStatut((prevState) => ({ ...prevState, show: false }))
        }
      />
      {showLoader && (
        <Loader
          statut={postRatesStatut}
          onServerResponse={handleServerResponse}
          message={{
            success: null,
            error: null,
          }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className={classes["gites__grid-container"]}>
          <p className={classes["gites__grid-items"]}>header1</p>
          <p className={classes["gites__grid-items"]}>header2</p>
          <p className={classes["gites__grid-items"]}>header3</p>
          <div className={classes["gites__grid-items"]}>
            <input
              className={classes["gites__input"]}
              value={priceValues.price1 || "non défini"}
              id="price1"
              min={1}
              max={9999}
              onChange={handleValueChange}
              type="number"
              name="country"
              disabled={isAuth ? false : true}
              required
            />
            <span>{priceValues.price1 && "€"}</span>
          </div>
          <div className={classes["gites__grid-items"]}>
            <input
              className={classes["gites__input"]}
              value={priceValues.price2 || "non défini"}
              id="price2"
              min={1}
              max={9999}
              onChange={handleValueChange}
              type="number"
              name="country"
              disabled={isAuth ? false : true}
              required
            />
            <span>{priceValues.price2 && "€"}</span>
          </div>
          <div className={classes["gites__grid-items"]}>
            <input
              className={classes["gites__input"]}
              value={priceValues.price3 || "non défini"}
              id="price3"
              min={1}
              max={9999}
              onChange={handleValueChange}
              type="number"
              name="country"
              disabled={isAuth ? false : true}
              required
            />
            <span>{priceValues.price3 && "€"}</span>
          </div>
        </div>
        {isAuth && <button>Modifier</button>}
      </form>
    </>
  );
};

export default Rates;
