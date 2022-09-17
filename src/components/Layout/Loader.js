import { useEffect, useState } from "react";

import classes from "./Loader.module.css";

const Loader = (props) => {
  const [loaderContent, setLoaderContent] = useState();
  const { statut, onRequestEnd, message } = props;

  useEffect(() => {
    if (statut === "send") {
      setLoaderContent(
        <div className={classes["loader-container"]}>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
        </div>
      );
    } else if (statut === "success") {
      if (!message?.success) return setLoaderContent(null);
      setLoaderContent(
        <span className={`${classes.message} ${classes.success}`}>
          {message.success}
        </span>
      );
    } else if (statut === "error") {
      if (!message?.error) return setLoaderContent(null);
      setLoaderContent(
        <span className={`${classes.message} ${classes.error}`}>
          {message.error}
        </span>
      );
    }
  }, [statut, message, onRequestEnd]);

  useEffect(() => {
    if (statut !== "send" && onRequestEnd) {
      onRequestEnd(statut);
    }
  }, [statut, onRequestEnd]);

  return loaderContent;
};

export default Loader;
