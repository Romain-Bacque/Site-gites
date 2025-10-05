// hooks import
import { useEffect, useState } from "react";
import { HTTPStateKind } from "../../../global/types";
// components import
import Alert from "../Alert";
import Loader from "../Loader";
// types import
import { StatutMessage } from "./types";

// constante & variable
const initialAlertState = {
  message: "",
  alertKind: null,
  show: false,
};

interface LoaderAndAlertProps {
  statut: HTTPStateKind | null;
  message?: string;
}


// component
const LoaderAndAlert: React.FC<LoaderAndAlertProps> = ({ statut, message }) => {
  const [alertStatut, setAlertStatut] =
    useState<StatutMessage>(initialAlertState);

  useEffect(() => {
    if (statut === HTTPStateKind.SUCCESS || statut === HTTPStateKind.ERROR) {
      if (!message) return setAlertStatut(initialAlertState);
      setAlertStatut({
        message,
        alertKind: statut,
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
      {statut === HTTPStateKind.PENDING && (
        <Loader message={message} />
      )}
      {(statut === HTTPStateKind.SUCCESS || statut === HTTPStateKind.ERROR) && (
        <Alert
          message={alertStatut.message}
          alert={alertStatut.alertKind}
          show={alertStatut.show}
          onAlertClose={() =>
            setAlertStatut((prevState) => ({ ...prevState, show: false }))
          }
        />
      )}
    </>
  );
};

export default LoaderAndAlert;
