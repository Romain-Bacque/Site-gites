// components import
import classes from "./style.module.css";
import ShelterItem from "../ShelterItem";
// types import
import { getSheltersWithPicturesRequest } from "../../../lib/api";
import { useMyQuery } from "hooks/use-query";
import { useEffect } from "react";
import useHTTPState from "hooks/use-http-state";

// component
const Shelters: React.FC = () => {
  const handleHTTPState = useHTTPState();
  const {
    data: sheltersData,
    status,
    isPending,
  } = useMyQuery({
    queryFn: getSheltersWithPicturesRequest,
    queryKey: ["shelters"],
  });

  useEffect(() => {
    handleHTTPState(
      status,
      status === "error" ? "Les gîtes sont indisponibles." : ""
    );
  }, [status, handleHTTPState]);

  if (isPending) {
    return (
      <section>
        <p className="text-center">Chargement des gîtes...</p>
      </section>
    );
  }

  if (status === "error" || !sheltersData || sheltersData.length === 0) {
    return (
      <section>
        <p className="text-center">Les gîtes sont indisponibles.</p>
      </section>
    );
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
