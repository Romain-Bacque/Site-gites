import { FallbackProps } from "react-error-boundary";
import classes from "./style.module.css";
import { useErrorBoundary } from "react-error-boundary";

const Fallback: React.FC<FallbackProps> = ({ error }) => {
  const { resetBoundary } = useErrorBoundary();

  return (
    <section className={classes.fallback}>
      <header className={classes.fallback__header}>
        <h3 className={classes.fallback__title}>Oops! Something went wrong!</h3>
      </header>
      <div className={classes.fallback__body}>
        <p>
          <strong>Error:</strong> {error?.message}
        </p>
        <button className={classes.fallback__button} onClick={resetBoundary}>
          Try again
        </button>
      </div>
    </section>
  );
};

export default Fallback;
