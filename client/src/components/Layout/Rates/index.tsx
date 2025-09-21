import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

import {
  getCSRF,
  ratesGetRequest,
  ratesPutRequest,
  setCSRFToken,
} from "../../../lib/api";
import classes from "./style.module.css";
import { useAppSelector } from "../../../hooks/use-store";
// types import
import {
  PriceValues,
  RatesProps,
  AlertStatut,
  RatesPutRequestData,
} from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { HTTPStateKind } from "../../../global/types";
import useLoading from "../../../hooks/use-loading";
import Button from "../../UI/Button"; // <-- Import your custom Button

// variable & constante
const initialState = {
  message: null,
  alert: null,
  show: false,
};

// component
const Rates: React.FC<RatesProps> = ({ shelterId }) => {
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [priceValues, sePriceValues] = useState<PriceValues>({
    price1: null,
    price2: null,
    price3: null,
  });
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const handleLoading = useLoading();

  const { sendHttpRequest: getCSRFttpRequest, data: CSRFData } =
    useHttp(getCSRF);
  const {
    sendHttpRequest: getRatesHttpRequest,
    statut: getRatesStatut,
    data: getRatesData,
    error: getRatesError,
  } = useHttp(ratesGetRequest);
  const {
    sendHttpRequest: putRatesHttpRequest,
    statut: putRatesStatut,
    error: putRatesError,
  } = useHttp(ratesPutRequest);

  const formIsValid =
    priceValues.price1 !== null &&
    priceValues.price2 !== null &&
    priceValues.price3 !== null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formIsValid) return;

    const data: RatesPutRequestData = {
      shelterId,
      price1: priceValues.price1!,
      price2: priceValues.price2!,
      price3: priceValues.price3!,
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
    getRatesHttpRequest(shelterId);
  }, [getRatesHttpRequest, shelterId]);

  // get csrf token
  useEffect(() => {
    getCSRFttpRequest();
  }, []);

  // set csrf token
  useEffect(() => {
    setCSRFToken(CSRFData);
  }, [CSRFData]);

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
      handleLoading(getRatesStatut, null, null, getRatesError);
    }
  }, [getRatesError, getRatesStatut, handleLoading]);

  // edit rates request loading statut
  useEffect(() => {
    if (putRatesStatut) {
      handleLoading(
        putRatesStatut,
        null,
        "Prix modifiés avec succés.",
        putRatesError
      );
    }
  }, [handleLoading, putRatesError, putRatesStatut]);

  if (getRatesStatut === HTTPStateKind.PENDING) {
    return null;
  }

  return (
    <div className={classes["rates-container"]}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes["rates__grid-container"]}>
          <p className={classes["rates__grid-items"]}>header1</p>
          <p className={classes["rates__grid-items"]}>header2</p>
          <p className={classes["rates__grid-items"]}>header3</p>
          <div className={classes["rates__grid-items"]}>
            <input
              className={classes["rates__input"]}
              value={priceValues.price1 || ""}
              placeholder="non défini"
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
            {
              <input
                className={classes["rates__input"]}
                value={priceValues.price2 || ""}
                placeholder="non défini"
                id="price2"
                min={1}
                max={9999}
                onChange={handleValueChange}
                type="number"
                name="country"
                disabled={isAuth ? false : true}
                required
              />
            }
            <span>{priceValues.price2 && "€"}</span>
          </div>
          <div className={classes["rates__grid-items"]}>
            <input
              className={classes["rates__input"]}
              value={priceValues.price3 || ""}
              placeholder="non défini"
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
        {isAuth && (
          <Button
            variant="primary"
            size="lg"
            icon={() => <FontAwesomeIcon icon={faPen} />}
            iconPosition="right"
            className="button--alt"
            type="submit"
          >
            Enregistrer les modifications
          </Button>
        )}
      </form>
    </div>
  );
};

export default Rates;
