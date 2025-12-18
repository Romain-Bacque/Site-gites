import Button from "../../../../components/UI/Button";
import useQueryParams from "../../../../hooks/use-query-params";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./style.module.css";

const EmailConfirm: React.FC = () => {
  const history = useHistory();
  const query = useQueryParams();
  const { t } = useTranslation();

  if (!("isValid" in query) || query.isValid === undefined) {
    history.push("/");
  }

  const isValidAccount = query.isValid === "true";

  return (
    <section>
      <div className={styles.EmailConfirmContainer}>
        <h1 className={styles.EmailConfirmContainer__title}>
          {isValidAccount
            ? t("emailConfirmation.accountValid")
            : t("emailConfirmation.accountInvalid")}
        </h1>
        {isValidAccount && (
          <Button
            variant="secondary"
            onClick={() => history.push("/authentification/login")}
          >
            {t("emailConfirmation.login")}
          </Button>
        )}
      </div>
    </section>
  );
};

export default EmailConfirm;
