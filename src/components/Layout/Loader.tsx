import { useEffect, useState } from "react";

import { HTTPStateKind, StatutType } from "../../hooks/use-http";
import classes from "./Loader.module.css";

// interfaces
interface LoaderProps {
  statut: StatutType;
  onRequestEnd: (statut: HTTPStateKind) => void;
  message: {
    success: null | string;
    error: null | string;
  };
}

const Loader: React.FC<LoaderProps> = (props) => {
  // null is nothing, react.fragment will be an object of type fragment which will have to be created by react.
  // so, its better to use null in useState generic union type below instead of a fragment, because using fragment is per definition slower
  const [loaderContent, setLoaderContent] = useState<JSX.Element | null>(null);
  const { statut, onRequestEnd, message } = props;

  useEffect(() => {
    if (statut === HTTPStateKind.SEND) {
      setLoaderContent(
        <div className={classes["loader-container"]}>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
        </div>
      );
    } else if (statut === HTTPStateKind.SUCCESS) {
      if (!message?.success) return setLoaderContent(null);
      setLoaderContent(
        <span className={`${classes.message} ${classes.success}`}>
          {message.success}
        </span>
      );
    } else if (statut === HTTPStateKind.ERROR) {
      if (!message?.error) return setLoaderContent(null);
      setLoaderContent(
        <span className={`${classes.message} ${classes.error}`}>
          {message.error}
        </span>
      );
    }
  }, [statut, message, onRequestEnd]);

  useEffect(() => {
    if (statut === HTTPStateKind.SUCCESS || statut === HTTPStateKind.ERROR) {
      onRequestEnd && onRequestEnd(statut);
    }
  }, [statut, onRequestEnd]);

  return loaderContent;
};

export default Loader;
