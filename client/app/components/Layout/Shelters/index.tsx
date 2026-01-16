"use client";

import classes from "./style.module.css";
import ShelterItem from "../ShelterItem";

import {
  getSheltersWithPicturesRequest,
  ShelterWithPictures,
} from "../../../lib/api";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import useHTTPState from "@/app/hooks/use-http-state";
import { useMyQuery } from "@/app/hooks/use-query";

const Shelters: React.FC<{
  shelters: ShelterWithPictures[];
  shelterId?: string;
}> = ({ shelters, shelterId }) => {
  const shelterRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const t = useTranslations();
  const locale = useLocale();
  const handleHTTPState = useHTTPState();

  const {
    data: sheltersData,
    status,
    isPending,
  } = useMyQuery({
    queryFn: getSheltersWithPicturesRequest,
    queryKey: ["sheltersWithPictures"],
    initialData: shelters,
    staleTime: 60 * 1000, // aligné avec ISR
  });

  useEffect(() => {
    handleHTTPState(status, status === "error" ? t("shelters.error") : "");
  }, [status, handleHTTPState, t]);

  useEffect(() => {
    if (shelterId && shelterRefs.current[shelterId]) {
      shelterRefs.current[shelterId]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shelterId, sheltersData]);

  if (isPending && !sheltersData?.length) {
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
      <ul className={classes.shelters}>
        {sheltersData.map((shelter) => (
          <li
            className={classes.shelter}
            key={shelter._id}
            ref={(el) => {
              shelterRefs.current[shelter._id] = el;
            }}
          >
            <ShelterItem
              shelterId={shelter._id}
              title={shelter.title}
              initialDescriptionText={
                shelter.description.find((desc) => desc.lang === locale)
                  ?.text || ""
              }
              images={shelter.images}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Shelters;
