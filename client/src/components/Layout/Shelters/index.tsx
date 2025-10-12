// hooks import
import useHttp from "../../../hooks/use-http";
import { useEffect } from "react";
import useHTTPState from "../../../hooks/use-http-state";
// components import
import Card from "../../UI/Card";
import classes from "./style.module.css";
import ShelterItem from "../ShelterItem";
// types import
import { getSheltersWithPicturesRequest } from "../../../lib/api";
import { HTTPStateKind } from "../../../global/types";

// component
const Shelters: React.FC = () => {
  const handleHTTPState = useHTTPState();
  const {
    sendHttpRequest: getShelterHttpRequest,
    statut: getSheltersRequestStatut,
    data: sheltersData,
    error: getSheltersRequestError,
  } = useHttp(getSheltersWithPicturesRequest);

  useEffect(() => {
    getShelterHttpRequest();
  }, [getShelterHttpRequest]);

  // shelters request loading handling
  useEffect(() => {
    if (!getSheltersRequestError) {
      handleHTTPState(getSheltersRequestStatut);
    } else {
      handleHTTPState(3, getSheltersRequestError);
    }
  }, [getSheltersRequestError, getSheltersRequestStatut, handleHTTPState]);

  if (getSheltersRequestStatut === HTTPStateKind.PENDING) {
    return <p className="text-center">Chargement des gîtes...</p>;
  }

  return (
    <section>
      {sheltersData && sheltersData.length > 0 ? (
        <ul className={classes.shelters}>
          {sheltersData.map((shelter) => {
            return (
              <li className={classes.shelter} key={shelter._id}>
                <ShelterItem
                  key={shelter._id}
                  shelterId={shelter._id}
                  title={shelter.title}
                  description={shelter.description}
                  images={shelter.images}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center">Les gîtes sont indisponibles.</p>
      )}
    </section>
  );
};

export default Shelters;
