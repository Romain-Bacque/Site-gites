import { FallbackProps } from "react-error-boundary";
import classes from "./style.module.css";
import { useErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

const Fallback: React.FC<FallbackProps> = ({ error }) => {
  const { resetBoundary } = useErrorBoundary();
  const { t } = useTranslation();

  return (
    <section className={classes.fallback}>
      <header className={classes.fallback__header}>
        <h3 className={classes.fallback__title}>
          {t("errorBoundaryfallback.title")}
        </h3>
      </header>
      <div className={classes.fallback__body}>
        <p>
          <strong>{t("errorBoundaryfallback.errorLabel")}</strong> {error?.message}
        </p>
        <button className={classes.fallback__button} onClick={resetBoundary}>
          {t("errorBoundaryfallback.retry")}
        </button>
      </div>
    </section>
  );
};

export default Fallback;
