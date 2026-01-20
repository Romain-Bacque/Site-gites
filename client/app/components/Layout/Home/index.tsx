"use client";

import { useEffect, useState } from "react";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import Alert from "../../UI/Alert";
import { AlertStatut, HomePageProps } from "./types";
import { getShelters } from "../../../lib/api";
import { ArrowRightAlt, ImageNotSupported } from "@mui/icons-material";
import Button from "../../UI/Button";
import useHTTPState from "@/app/hooks/use-http-state";
import { useMyQuery } from "@/app/hooks/use-query";
import CardSkeleton from "../../UI/Skeletons/CardSkeleton";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const initialState = {
  message: null,
  alert: null,
  show: false,
};

const Home: React.FC<HomePageProps> = ({ shelters }) => {
  const t = useTranslations();
  const handleHTTPState = useHTTPState();
  const router = useRouter();
  const locale = useLocale();
  const [alertStatut, setAlertStatut] = useState<AlertStatut>(initialState);
  const [bannerOffsetY, setBannerOffsetY] = useState(0);

  const {
    data: sheltersData,
    error: sheltersQueryError,
    isPending: sheltersIsPending,
  } = useMyQuery({
    queryKey: ["shelters"],
    queryFn: getShelters,
    initialData: shelters,
    staleTime: 3600 * 1000, // 1 hour
    enabled: false,
  });

  useEffect(() => {
    if (sheltersQueryError) {
      handleHTTPState("error", t("home.loadError"));
    }
  }, [router, sheltersQueryError, handleHTTPState, t]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      setBannerOffsetY(window.scrollY * 0.3);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderDetailsButton = (shelterId: string) => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const size = width > 768 ? "lg" : width > 480 ? "md" : "sm";

    return (
      <Button
        icon={ArrowRightAlt}
        iconPosition="right"
        size={size}
        onClick={() => router.push(`/${locale}/shelters/${shelterId}`)}
      >
        {t("home.seeDetails")}
      </Button>
    );
  };

  const renderShelters = () => {
    if (sheltersIsPending) {
      return [...Array(2)].map((_, index) => (
        <CardSkeleton className={classes.gite} key={index} />
      ));
    } else if (sheltersData && sheltersData.length > 0) {
      return sheltersData.map((shelter) => (
        <Card key={shelter._id} className={classes.gite}>
          <div
            onClick={() => router.push(`/${locale}/shelters/${shelter._id}`)}
            className={classes["gite__picture-container"]}
          >
            {shelter.mainImage ? (
              <div className={classes["gite__picture-wrapper"]}>
                <Image
                  src={shelter.mainImage.url}
                  alt={shelter.title}
                  fill // fill is a property that makes the image cover the parent div (under the hood it sets position: absolute, top: 0, left: 0, width: 100%, height: 100%)
                  className={classes.gite__picture}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="text-center space">
                <ImageNotSupported sx={{ fontSize: "5rem", color: "#bbb" }} />
                <p>{t("home.noImage")}</p>
              </div>
            )}
          </div>
          <div className={classes["gite__text-container"]}>
            <div>
              <h3 className={classes.gite__name}>{shelter.title}</h3>
              <div>
                <p className={classes.gite__places}>
                  {t("home.capacity")}{" "}
                  <span className="bold">{t("home.people")}</span>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              {renderDetailsButton(shelter._id)}
            </div>
          </div>
        </Card>
      ));
    } else {
      return <p className="text-center">{t("home.noShelters")}</p>;
    }
  };

  return (
    <>
      <Alert
        message={alertStatut.message}
        alert={alertStatut.alert}
        show={alertStatut.show}
        onAlertClose={() =>
          setAlertStatut((prevState) => ({ ...prevState, show: false }))
        }
      />
      <section>
        <Card className={classes.banner}>
          <div className={classes.banner__parallax}>
            <Image
              src="/img/landscape.jpg"
              alt="Paysage du site"
              fill
              priority
              className={classes.banner__image}
              style={{ transform: `translateY(${bannerOffsetY}px)` }}
              sizes="100vw"
            />
          </div>
          <div className={classes["banner__site-branding"]}>
            <h1 className={classes["banner__site-title"]}>
              {t("home.bannerTitle")}
            </h1>
            <h2 className={classes["banner__site-description"]}>
              {t("home.bannerSubtitle")}
            </h2>
          </div>
        </Card>
      </section>
      <section>
        <article className={classes.summary}>
          <strong className={classes.summary__label}>
            {t("home.summaryLabel")}
          </strong>
          <p
            className={classes.summary__paragraphe}
            dangerouslySetInnerHTML={{ __html: t("home.summaryText") }}
          />
          <Button
            size="xl"
            className={classes.banner__button}
            iconPosition="right"
            icon={ArrowRightAlt}
            onClick={() =>
              window.open(
                "https://www.tourisme-couserans-pyrenees.com/carnet-dadresses/",
                "_blank",
              )
            }
            variant="outline"
          >
            {t("home.activitiesButton")}
          </Button>
        </article>
      </section>
      <section className={classes.gites}>{renderShelters()}</section>
    </>
  );
};

export default Home;
