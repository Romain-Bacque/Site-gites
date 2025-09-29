import { useEffect, useState, useCallback } from "react";
import useHttp from "../../../hooks/use-http";
import {
  getCSRF,
  ratesGetRequest,
  ratesPutRequest,
  setCSRFToken,
} from "../../../lib/api";
import classes from "./style.module.css";
import { useAppSelector } from "../../../hooks/use-store";
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
import Button from "../../UI/Button";

const initialState: AlertStatut = {
  message: null,
  alert: null,
  show: false,
};

const initialPrices: PriceValues = {
  price1: null,
  price2: null,
  price3: null,
};

const Rates: React.FC<RatesProps> = ({ shelterId }) => {
  const [alertStatut, setAlertStatut] = useState(initialState);
  const [priceValues, setPriceValues] = useState(initialPrices);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const handleLoading = useLoading();

  const { sendHttpRequest: getCSRFttpRequest, data: CSRFData } = useHttp(getCSRF);
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
      price1: Number(priceValues.price1),
      price2: Number(priceValues.price2),
      price3: Number(priceValues.price3),
    };

    putRatesHttpRequest(data);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setPriceValues((prev) => ({
      ...prev,
      [id]: value ? Number(value) : null,
    }));
  };

  useEffect(() => {
    if (getRatesData && typeof getRatesData === "object") {
      setPriceValues({
        price1: getRatesData.price1,
        price2: getRatesData.price2,
        price3: getRatesData.price3,
      });
    }
  }, [getRatesData]);

  useEffect(() => {
    getRatesHttpRequest(shelterId);
  }, [getRatesHttpRequest, shelterId]);

  useEffect(() => {
    getCSRFttpRequest();
  }, [getCSRFttpRequest]);

  useEffect(() => {
    setCSRFToken(CSRFData);
  }, [CSRFData]);

  useEffect(() => {
    if (alertStatut.show) {
      const timer = setTimeout(() => {
        setAlertStatut((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertStatut.show]);

  useEffect(() => {
    if (getRatesStatut) {
      handleLoading(getRatesStatut, null, null, getRatesError);
    }
  }, [getRatesError, getRatesStatut, handleLoading]);

  useEffect(() => {
    if (putRatesStatut) {
      handleLoading(
        putRatesStatut,
        null,
        "Prix modifiés avec succès.",
        putRatesError
      );
    }
  }, [handleLoading, putRatesError, putRatesStatut]);

  if (getRatesStatut === HTTPStateKind.PENDING) {
    return null;
  }

  const renderInput = (id: keyof PriceValues) => (
    <div className={classes["rates__grid-items"]}>
      <input
        className={classes["rates__input"]}
        value={priceValues[id] ?? ""}
        placeholder="non défini"
        id={id}
        min={1}
        max={9999}
        onChange={handleValueChange}
        type="number"
        name={id}
        disabled={!isAuth}
        required
      />
      <span>{priceValues[id] && "€"}</span>
    </div>
  );

  return (
    <div className={classes["rates-container"]}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes["rates__grid-container"]}>
          <p className={classes["rates__grid-items"]}>header1</p>
          <p className={classes["rates__grid-items"]}>header2</p>
          <p className={classes["rates__grid-items"]}>header3</p>
          {renderInput("price1")}
          {renderInput("price2")}
          {renderInput("price3")}
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
