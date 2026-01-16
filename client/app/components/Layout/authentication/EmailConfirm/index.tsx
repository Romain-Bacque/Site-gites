"use client";

import Button from "../../../UI/Button";
import useQueryParams from "../../../../hooks/use-query-params";
import { useTranslations } from "next-intl";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

const EmailConfirm: React.FC = () => {
  const router = useRouter();
  const query = useQueryParams();
  const t = useTranslations();

  if (!("isValid" in query) || query.isValid === undefined) {
    router.push("/");
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
            onClick={() => router.push("/authentication/login")}
          >
            {t("emailConfirmation.login")}
          </Button>
        )}
      </div>
    </section>
  );
};

export default EmailConfirm;
