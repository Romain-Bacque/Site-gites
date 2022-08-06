import { useEffect, useState } from "react";

import classes from "./Loader.module.css";

const Loader = (props) => {
  const [statutContent, setStatutContent] = useState();

  const { onSuccess, statut, message } = props;

  useEffect(() => {
    if (statut === "send") {
      setStatutContent(
        <div className={classes["loader-container"]}>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
        </div>
      );
    } else if (statut === "success") {
      if (!message?.success) return setStatutContent(null);
      setStatutContent(
        <span className="success message">{message.success}</span>
      );
    } else if (statut === "error") {
      if (!message?.error) return setStatutContent(null);
      setStatutContent(<span className="error message">{message.error}</span>);
    }
  }, [statut, message, onSuccess]);

  useEffect(() => {
    if (statut === "success" && onSuccess) onSuccess();
  }, [statut, onSuccess]);

  return statutContent;
};

export default Loader;
