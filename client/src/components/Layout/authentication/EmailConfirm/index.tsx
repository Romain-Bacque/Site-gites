import Button from "../../../../components/UI/Button";
import useQueryParams from "../../../../hooks/use-query-params";
import { useHistory } from "react-router-dom";
import styles from "./style.module.css";

const EmailConfirm: React.FC = () => {
  const history = useHistory();
  const query = useQueryParams();

  if (!("isValid" in query) || query.isValid === undefined) {
    history.push("/");
  }

  const isValidAccount = query.isValid === "true";

  return (
    <section>
      <div className={styles.EmailConfirmContainer}>
        <h1 className={styles.EmailConfirmContainer__title}>
          {isValidAccount
            ? "Votre compte a été validé !"
            : "Votre compte n'a pas pu être validé."}
        </h1>
        {isValidAccount && (
          <Button
            variant="secondary"
            onClick={() => history.push("/authentification/login")}
          >
            Se connecter
          </Button>
        )}
      </div>
    </section>
  );
};

export default EmailConfirm;
