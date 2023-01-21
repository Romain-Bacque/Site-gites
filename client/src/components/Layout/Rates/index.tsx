import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

import { ratesGetRequest, ratesPutRequest } from "../../../lib/api";
import classes from "./style.module.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/use-store";
// types import
import { PriceValues, RatesProps, AlertStatut, RatesPutRequestData } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { loadingActions } from "../../../store/loading";
import { HandleLoading, HTTPStateKind } from "../../../global/types";

// variable & constante
const initialState = {
  message: null,
  alert: null,
  show: false,
};

// component
const Rates: React.FC<RatesProps> = ({ shelter }) => {
  const dispatch = useAppDispatch()
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [priceValues, sePriceValues] = useState<PriceValues>({
    price1: 1,
    price2: 1,
    price3: 1,
  });
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const { sendHttpRequest: getRatesHttpRequest, statut: getRatesStatut, data: getRatesData, error: getRatesError } =
    useHttp(ratesGetRequest);
  const { sendHttpRequest: putRatesHttpRequest, statut: putRatesStatut, error: putRatesError } =
    useHttp(ratesPutRequest);

  const formIsValid =
    !isNaN(priceValues.price1) &&
    !isNaN(priceValues.price2) &&
    !isNaN(priceValues.price3);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formIsValid) return;

    const data: RatesPutRequestData = {
      shelterId: shelter,
      price1: priceValues.price1,
      price2: priceValues.price2,
      price3: priceValues.price3,
    };

    putRatesHttpRequest(data);
  };

  const handleValueChange = (event: React.ChangeEvent) => {
    sePriceValues((prevState) => {
      return {
        ...prevState,
        [event.target.id]: (event.target as HTMLInputElement).value,
      };
    });
  };

  const handleLoading: HandleLoading = (statut, success, error) => {
    dispatch(loadingActions.setStatut(statut))
    dispatch(loadingActions.setMessage({
      success,
      error
    }))
  }

  useEffect(() => {
    if (getRatesData && typeof getRatesData === "object") {
      sePriceValues({
        price1: getRatesData.price1,
        price2: getRatesData.price2,
        price3: getRatesData.price3,
      });
    }
  }, [getRatesData]);

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

  useEffect(() => {
    if (getRatesStatut) {
      handleLoading(getRatesStatut, null, getRatesError);
    }
  }, [getRatesStatut]);

  // edit rates request loading statut
  useEffect(() => {
    if (putRatesStatut) {
      handleLoading(putRatesStatut, "Prix modifiés avec succés.", putRatesError);
    }
  }, [putRatesStatut]);
  
  return (
    <>
      {getRatesStatut === HTTPStateKind.SUCCESS &&
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes["rates__grid-container"]}>
          <p className={classes["rates__grid-items"]}>header1</p>
          <p className={classes["rates__grid-items"]}>header2</p>
          <p className={classes["rates__grid-items"]}>header3</p>
          <div className={classes["rates__grid-items"]}>
            <input
              className={classes["rates__input"]}
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
          <div className={classes["rates__grid-items"]}>
            <input
              className={classes["rates__input"]}
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
          <div className={classes["rates__grid-items"]}>
            <input
              className={classes["rates__input"]}
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
        {isAuth && <button className="button button--alt">
          Enregistrer les modifications
          <FontAwesomeIcon className="button__icon" icon={faPen} />
        </button>}
      </form>}
    {getRatesStatut === HTTPStateKind.ERROR &&
      <p className="text-center">Les tarifs sont indisponibles.</p>}
    </>
  );
};

export default Rates;
