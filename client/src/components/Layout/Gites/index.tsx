import { useState } from "react";
import { useEffect } from "react";
import useHttp, { HTTPStateKind } from "../../../hooks/use-http";

import Card from "../../UI/Card";
import classes from "./style.module.css";
import GitesItems from "../GitesItems";
import { getShelters } from "../../../lib/api";
import { loadingActions } from "../../../store/loading";
import { useAppDispatch } from "../../../hooks/use-store";

// component
const Gites: React.FC = () => {
  const [shelterList, setShelterList] = useState<JSX.Element[]>([]);
  const dispatch = useAppDispatch();

  const {
    sendHttpRequest: sendShelterHttpRequest,
    statut: sheltersRequestStatut,
    data: sheltersData,
    error: sheltersRequestError
  } = useHttp(getShelters);

  useEffect(() => {
    sendShelterHttpRequest();
  }, []);

  const handleSheltersList = () => {
    if (sheltersRequestStatut === HTTPStateKind.SUCCESS && sheltersData) {
      let shelters: JSX.Element[] = [];

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

  // loading
  useEffect(() => {
    if (sheltersRequestStatut) {
      dispatch(loadingActions.setStatut(sheltersRequestStatut));
      dispatch(loadingActions.setMessage({
        success: null,
        error: sheltersRequestError,
      }));

      if(sheltersRequestStatut !== HTTPStateKind.SEND) {
        handleSheltersList();
      }
    }
  }, [sheltersRequestStatut]);

  return (
    <section>
      {shelterList}
      {sheltersRequestStatut === HTTPStateKind.ERROR &&
      <p className="text-center">Les gites sont indisponibles.</p>}
    </section>
  );
};

export default Gites;
