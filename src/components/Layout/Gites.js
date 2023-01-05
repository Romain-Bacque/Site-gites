import { useState } from "react";
import { useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { getShelters } from "../../lib/api";
import Card from "../UI/Card";

import classes from "./Gites.module.css";
import GitesItems from "./GitesItems";
import Loader from "./Loader";

const Gites = () => {
  const [shelterList, setShelterList] = useState(false);
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
    if (sheltersRequestStatut === "success") {
      setShowLoader(false);
      const shelters = sheltersData
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
