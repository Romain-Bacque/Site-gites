import classes from "./style.module.css";

const Loader = ({ message }: { message: string | null | undefined }) => {
  return message ? (
    <p>{message}</p>
  ) : (
    <div className={classes["loader-container"]}>
      <span className={classes["loader-container__dot"]}></span>
      <span className={classes["loader-container__dot"]}></span>
      <span className={classes["loader-container__dot"]}></span>
    </div>
  );
};

export default Loader;
