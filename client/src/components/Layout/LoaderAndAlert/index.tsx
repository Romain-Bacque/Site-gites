import { useEffect, useState } from "react";

import { HTTPStateKind } from "../../../hooks/use-http";
import Alert, { AlertKind } from "../../UI/Alert";
import Loader from "../../UI/Loader";
import classes from "./style.module.css";
// types import
import { LoaderAndAlertProps, StatutMessage } from "./types";

// constante & variable
const initialAlertState = {
  message: "",
  alertKind: null,
  show: false,
};

// component
const LoaderAndAlert: React.FC<LoaderAndAlertProps> = (props) => {
  // null is nothing, react.fragment will be an object of type fragment which will have to be created by react.
  // so, its better to use null in useState generic union type below instead of a fragment, because using fragment is per definition slower
  const [showLoader, setShowLoader] = useState(false);
  const [alertStatut, setAlertStatut] =
    useState<StatutMessage>(initialAlertState);
  const { statut, onServerResponse, message } = props;

  useEffect(() => {
    if (statut === HTTPStateKind.SEND) {
      setShowLoader(true);
    } else if (statut === HTTPStateKind.SUCCESS) {
      setShowLoader(false);
      if (!message?.success) return setAlertStatut(initialAlertState);
      setAlertStatut({
        message: message.success,
        alertKind: AlertKind.SUCCESS,
        show: true,
      });
    } else if (statut === HTTPStateKind.ERROR) {
      setShowLoader(false);
      if (!message?.error) return setAlertStatut(initialAlertState);
      setAlertStatut({
        message: message.error,
        alertKind: AlertKind.ERROR,
        show: true,
      });
    }
  }, [statut, message, onServerResponse]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // if Alert component is already shown, then we hide it after defined period of time
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
    // We possibly execute the 'onServerResponse' function when we've got the server response
    if (statut === HTTPStateKind.SUCCESS || statut === HTTPStateKind.ERROR) {
      onServerResponse && onServerResponse(statut);
    }
  }, [statut, onServerResponse]);

  return (
    <>
      {showLoader && <Loader />}
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
