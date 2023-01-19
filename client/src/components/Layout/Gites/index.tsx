import { useState } from "react";
import { useEffect } from "react";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import GitesItems from "../GitesItems";
import LoaderAndAlert from "../LoaderAndAlert";
import { getShelters } from "../../../lib/api";

// component
const Gites: React.FC = () => {
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
    if (sheltersRequestStatut === HTTPStateKind.SUCCESS && sheltersData) {
      let shelters: JSX.Element[] = [];

      setShowLoader(false);
      if (typeof sheltersData === "object") {
        shelters = sheltersData
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
        <LoaderAndAlert
          statut={sheltersRequestStatut}
          onServerResponse={handleSheltersList}
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
