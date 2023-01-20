// hooks import
import { useEffect, useState } from "react";
// components import
import Alert, { AlertKind } from "../../UI/Alert";
import Loader from "../../UI/Loader";
// types import
import { HTTPStateKind } from "../../../hooks/use-http";
import { LoaderAndAlertProps, StatutMessage } from "./types";

// constante & variable
const initialAlertState = {
  message: "",
  alertKind: null,
  show: false,
};

// component
const LoaderAndAlert: React.FC<LoaderAndAlertProps> = (props) => {
  const [alertStatut, setAlertStatut] =
    useState<StatutMessage>(initialAlertState);
  const { statut, message } = props;

  useEffect(() => {
    if (statut === HTTPStateKind.SUCCESS) {
      if (!message?.success) return setAlertStatut(initialAlertState);
      setAlertStatut({
        message: message.success,
        alertKind: AlertKind.SUCCESS,
        show: true,
      });
    } else if (statut === HTTPStateKind.ERROR) {
      if (!message?.error) return setAlertStatut(initialAlertState);
      setAlertStatut({
        message: message.error,
        alertKind: AlertKind.ERROR,
        show: true,
      });
    }
  }, [statut, message]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // if Alert component is already shown, then we hide it
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
      {statut === HTTPStateKind.SEND && <Loader />}
      <Alert
        message={alertStatut.message}
        alert={alertStatut.alertKind}
        show={alertStatut.show}
        onAlertClose={() =>
          setAlertStatut((prevState) => ({ ...prevState, show: false }))
        }
      />
    </>
  );
};

export default LoaderAndAlert;
