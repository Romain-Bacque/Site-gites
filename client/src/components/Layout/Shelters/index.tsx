// components import
import classes from "./style.module.css";
import ShelterItem from "../ShelterItem";

// types / hooks
import { getSheltersWithPicturesRequest } from "../../../lib/api";
import { useMyQuery } from "hooks/use-query";
import { useEffect } from "react";
import useHTTPState from "hooks/use-http-state";
import { useTranslation } from "react-i18next";

// component
const Shelters: React.FC = () => {
  const handleHTTPState = useHTTPState();
  const { t } = useTranslation();

  const {
    data: sheltersData,
    status,
    isPending,
  } = useMyQuery({
    queryFn: getSheltersWithPicturesRequest,
    queryKey: ["sheltersWithPictures"],
  });

  useEffect(() => {
    handleHTTPState(status, status === "error" ? t("shelters.error") : "");
  }, [status, handleHTTPState, t]);

  if (isPending) {
    return (
      <section>
        <p className="text-center">{t("shelters.loading")}</p>
      </section>
    );
  }

  if (status === "error" || !sheltersData || sheltersData.length === 0) {
    return (
      <section>
        <p className="text-center">{t("shelters.error")}</p>
      </section>
    );
  }

  return (
    <section>
      {sheltersData.length > 0 ? (
        <ul className={classes.shelters}>
          {sheltersData.map((shelter) => (
            <li className={classes.shelter} key={shelter._id}>
              <ShelterItem
                shelterId={shelter._id}
                title={shelter.title}
                description={shelter.description}
                images={shelter.images}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">{t("shelters.error")}</p>
      )}
    </section>
  );
};

export default Shelters;
