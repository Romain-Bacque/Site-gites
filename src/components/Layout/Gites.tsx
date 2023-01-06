import { useState } from "react";
import { useEffect } from "react";
import useHttp from "../../hooks/use-http";

import Card from "../UI/Card";
import classes from "./Gites.module.css";
import GitesItems from "./GitesItems";
import Loader from "./Loader";
import { getShelters } from "../../lib/api";

type Shelter = {
  _id: string;
  title: string;
  number: number;
};

const Gites = () => {
  const [shelterList, setShelterList] = useState<JSX.Element[]>([]);
  const [showLoader, setShowLoader] = useState(false);
  const {
    sendHttpRequest: sendShelterHttpRequest,
    statut: sheltersRequestStatut,
    data: sheltersData,
  } = useHttp(getShelters);

  useEffect(() => {
    sendShelterHttpRequest();
    setShowLoader(true);
  }, []);

  const handleSheltersList = () => {
    if (sheltersRequestStatut === "success" && sheltersData) {
      let shelters: JSX.Element[] = [];

      setShowLoader(false);
      if (
        typeof sheltersData === "object" &&
        "_id" in sheltersData &&
        "number" in sheltersData &&
        "title" in sheltersData
      ) {
        shelters = (sheltersData as Shelter[])
          .sort((a, b) => a.number - b.number)
          .map((shelter) => {
            return (
              <Card key={shelter._id} className={classes.gite}>
                <GitesItems
                  shelterId={shelter._id}
                  title={shelter.title}
                  number={shelter.number}
                />
              </Card>
            );
          });
      }
      setShelterList(shelters);
    }
  };

  return (
    <section>
      {showLoader && (
        <Loader
          statut={sheltersRequestStatut}
          onRequestEnd={handleSheltersList}
          message={{
            success: null,
            error: "Une erreur est survenue !",
          }}
        />
      )}
      {shelterList}
    </section>
  );
};

export default Gites;
