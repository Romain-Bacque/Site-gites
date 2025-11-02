import { FallbackProps } from "react-error-boundary";
import classes from "./style.module.css";
import { useErrorBoundary } from "react-error-boundary";

const Fallback: React.FC<FallbackProps> = ({ error }) => {
  // resetBoundary permet de réinitialiser le boundary (retenter le rendu des enfants)
  const { resetBoundary } = useErrorBoundary();

  return (
    <section className={classes.fallback}>
      <header className={classes.fallback__header}>
        <h3 className={classes.fallback__title}>Oups ! Une erreur est survenue !</h3>
      </header>
      <div className={classes.fallback__body}>
        <p>
          <strong>Erreur :</strong> {error?.message}
        </p>
        <button className={classes.fallback__button} onClick={resetBoundary}>
          Réessayer
        </button>
      </div>
    </section>
  );
};

export default Fallback;
