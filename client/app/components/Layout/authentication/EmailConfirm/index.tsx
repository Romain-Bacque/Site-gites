"use client";

import Button from "../../../UI/Button";
import useQueryParams from "../../../../hooks/use-query-params";
import { useTranslations } from "next-intl";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EmailConfirm: React.FC = () => {
  const router = useRouter();
  const query = useQueryParams();
  const t = useTranslations();

  const isValidAccount = query.isValid === "true";

  useEffect(() => {
    if (!("isValid" in query) || query.isValid === undefined) {
      router.push("/");
    }
  }, [query, router]);

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
            onClick={() => router.push("/login")}
          >
            {t("emailConfirmation.login")}
          </Button>
        )}
      </div>
    </section>
  );
};

export default EmailConfirm;
