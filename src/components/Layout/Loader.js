import { useEffect, useState } from "react";

import classes from "./Loader.module.css";

const Loader = (props) => {
  const [messageContent, setMessageContent] = useState();
  const { statut, onSuccess } = props;

  useEffect(() => {
    if (props.statut === "send") {
      setMessageContent(
        <div className={classes["loader-container"]}>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
          <span className={classes["loader-container__dot"]}></span>
        </div>
      );
    } else if (props.statut === "success") {
      if (!props.message?.success) return setMessageContent(null);
      setMessageContent(
        <span
          className={`${
            props.className ? classes[props.classeName] : classes.message
          } ${classes.success}`}
        >
          {props.message.success}
        </span>
      );
    } else if (props.statut === "error") {
      if (!props.message?.error) return setMessageContent(null);
      setMessageContent(
        <span
          className={`${
            props.className ? classes[props.classeName] : classes.message
          } ${classes.error}`}
        >
          {props.message.error}
        </span>
      );
    }
  }, [props.statut, props.message, props.onSuccess]);

  useEffect(() => {
    console.log(props.statut);
    if (props.statut === "success" && props.onSuccess) props.onSuccess();
  }, [statut, onSuccess]);

  return props.show && <>{messageContent}</>;
};

export default Loader;
