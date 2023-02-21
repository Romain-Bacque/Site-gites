import { useState } from "react";
import { useEffect } from "react";
import useHttp from "../../../hooks/use-http";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import GitesItems from "../GitesItems";
import { getShelters } from "../../../lib/api";
import { loadingActions } from "../../../store/loading";
import { useAppDispatch } from "../../../hooks/use-store";
import { HTTPStateKind } from "../../../global/types";

// component
const Gites: React.FC = () => {
  const [shelterList, setShelterList] = useState<JSX.Element[]>([]);
  const dispatch = useAppDispatch();

  const {
    sendHttpRequest: getShelterHttpRequest,
    statut: getSheltersRequestStatut,
    data: getSheltersData,
    error: getSheltersRequestError
  } = useHttp(getShelters);
 
  const handleSheltersList = () => {
    if (getSheltersRequestStatut === HTTPStateKind.SUCCESS && getSheltersData) {
      let shelters: JSX.Element[] = [];

      if (typeof getSheltersData === "object") {
        shelters = getSheltersData
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

  // fetch all shelters
  useEffect(() => {
    getShelterHttpRequest();
  }, []);

  // shelters request loading handling
  useEffect(() => {
    if (getSheltersRequestStatut) {
      dispatch(loadingActions.setStatut(getSheltersRequestStatut));
      dispatch(loadingActions.setMessage({
        success: null,
        error: getSheltersRequestError,
      }));
      if(getSheltersRequestStatut !== HTTPStateKind.PENDING) {
        handleSheltersList();
      }
    }
  }, [getSheltersRequestStatut]);

  return (
    <section>
      {shelterList}
      {getSheltersRequestStatut === HTTPStateKind.ERROR &&
      <p className="text-center">Les gites sont indisponibles.</p>}
    </section>
  );
};

export default Gites;
