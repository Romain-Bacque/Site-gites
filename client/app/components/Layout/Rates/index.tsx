/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useMyQuery, useMyMutation } from "../../../hooks/use-query";
import { getCSRF, ratesGetRequest, ratesPutRequest } from "../../../lib/api";
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
import useHTTPState from "../../../hooks/use-http-state";
import Button from "../../UI/Button";
import { QueryClient } from "@tanstack/react-query";

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

const queryClient = new QueryClient();

const Rates: React.FC<RatesProps> = ({ shelterId }) => {
 const t = useTranslations();
  const [alertStatut, setAlertStatut] = useState(initialState);
  const [priceValues, setPriceValues] = useState(initialPrices);
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);
  const handleHTTPState = useHTTPState();

  const { refetch: fetchCSRF } = useMyQuery({
    queryKey: ["csrf"],
    queryFn: getCSRF,
  });

  const {
    data: getRatesData,
    status: getRatesStatus,
    error: getRatesError,
    isPending,
  } = useMyQuery({
    queryKey: ["rates", shelterId],
    queryFn: () => ratesGetRequest(shelterId),
    enabled: !!shelterId,
  });

  const {
    mutate: putRatesMutate,
    status: putRatesStatus,
    error: putRatesError,
  } = useMyMutation({
    mutationFn: (data: RatesPutRequestData) => ratesPutRequest(data),
    onSuccessFn: (data) => {
      queryClient.setQueryData(["rates", shelterId], (old: any) => {
        return old ? [...old, data] : [data];
      });
    },
  });

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

    putRatesMutate(data);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setPriceValues((prev) => ({
      ...prev,
      [id]: value ? Number(value) : null,
    }));
  };

  useEffect(() => {
    if (getRatesData) {
      setPriceValues({
        price1: getRatesData.price1,
        price2: getRatesData.price2,
        price3: getRatesData.price3,
      });
    }
  }, [getRatesData]);

  useEffect(() => {
    fetchCSRF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (alertStatut.show) {
      const timer = setTimeout(() => {
        setAlertStatut((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertStatut.show]);

  useEffect(() => {
    handleHTTPState(getRatesStatus);
  }, [getRatesStatus, getRatesError, handleHTTPState]);

  useEffect(() => {
    handleHTTPState(putRatesStatus);
  }, [putRatesStatus, putRatesError, handleHTTPState]);

  if (isPending) {
    return (
      <div className={classes["rates-container"]}>
        <p>{t("rates.loading")}</p>
      </div>
    );
  }

  const renderInput = (id: keyof PriceValues) => (
    <div className={classes["rates__cell-input"]}>
      <input
        className={classes["rates__input"]}
        value={priceValues[id] ?? ""}
        placeholder="—"
        id={id}
        min={1}
        max={9999}
        onChange={handleValueChange}
        type="number"
        name={id}
        disabled={!isAuth}
        required
      />
      <span className={classes["rates__euro"]}>€</span>
    </div>
  );

  return (
    <div className={classes["rates-container"]}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes["rates__grid-container"]}>
          <p className={`${classes["rates__grid-header"]} ${classes["low"]}`}>
            {t("rates.lowSeason")}
          </p>
          <p className={`${classes["rates__grid-header"]} ${classes["mid"]}`}>
            {t("rates.midSeason")}
          </p>
          <p className={`${classes["rates__grid-header"]} ${classes["high"]}`}>
            {t("rates.highSeason")}
          </p>

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
            className={classes["rates__button"]}
            type="submit"
          >
            {t("rates.saveChanges")}
          </Button>
        )}
      </form>
    </div>
  );
};

export default Rates;
