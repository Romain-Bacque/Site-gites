import { useCallback, useEffect, useState } from "react";
import useHttp, { HTTPStateKind } from "../../hooks/use-http";
import { ratesGetRequest, ratesPostRequest } from "../../lib/api";
import Loader from "./Loader";
import Alert from "../UI/Alert";
import classes from "./Rates.module.css";
import { useAppSelector } from "../../hooks/use-store";

// interfaces
interface StatutMessage {
  message: null | string;
  alert: null | string;
  show: boolean;
}
interface RatesProps {
  shelter: string;
}
interface PriceValues {
  price1: number;
  price2: number;
  price3: number;
}

// ---

const initialState = {
  message: null,
  alert: null,
  show: false,
};

const Rates: React.FC<RatesProps> = ({ shelter }) => {
  const [statutMessage, setStatutMessage] =
    useState<StatutMessage>(initialState);
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

  const handleRequestEnd = useCallback((statut: HTTPStateKind) => {
    if (statut === HTTPStateKind.SUCCESS) {
      setStatutMessage({
        message: "Prix enregistrés avec succés.",
        alert: "information",
        show: true,
      });
    } else
      setStatutMessage({
        message: "Enregistrement des prix impossible.",
        alert: "error",
        show: true,
      });
    setShowLoader(false);
  }, []);

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

  useEffect(() => {
    let timer;

    if (statutMessage.show) {
      timer = setTimeout(() => {
        setStatutMessage((prevState) => ({ ...prevState, show: false }));
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [statutMessage.show]);

  return (
    <>
      <Alert
        message={statutMessage.message}
        alert={statutMessage.alert}
        show={statutMessage.show}
      />
      {showLoader && (
        <Loader
          statut={postRatesStatut}
          onRequestEnd={handleRequestEnd}
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
              min="1"
              max="9999"
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
              min="1"
              max="9999"
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
              min="1"
              max="9999"
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
