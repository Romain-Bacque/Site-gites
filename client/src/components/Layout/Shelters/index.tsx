// components import
import classes from "./style.module.css";
import ShelterItem from "../ShelterItem";

// types / hooks
import { getSheltersWithPicturesRequest } from "../../../lib/api";
import { useMyQuery } from "hooks/use-query";
import { useEffect, useRef } from "react";
import useHTTPState from "hooks/use-http-state";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// component
const Shelters: React.FC = () => {
  const { shelterId } = useParams<{ shelterId: string }>();
  const shelterRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const { t, i18n } = useTranslation();
  const handleHTTPState = useHTTPState();

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

  useEffect(() => {
    if (shelterId && shelterRefs.current[shelterId]) {
      shelterRefs.current[shelterId]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shelterId, sheltersData]);

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
            <li
              className={classes.shelter}
              key={shelter._id}
              ref={(el) => (shelterRefs.current[shelter._id] = el)}
            >
              <ShelterItem
                shelterId={shelter._id}
                title={shelter.title}
                initialDescriptionText={
                  shelter.description.find(
                    (desc) => desc.lang === i18n.language
                  )?.text || ""
                }
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
