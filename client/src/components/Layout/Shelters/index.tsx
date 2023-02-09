// hooks import
import { useState, useEffect } from "react";
// components import
import Card from "../../UI/Card";
import classes from "./style.module.css";
import SheltersItems from "../SheltersItems";
// types import
import { SheltersProps } from "./types";
import { useAppSelector } from "../../../hooks/use-store";
import { HTTPStateKind } from "../../../global/types";

// component
const Shelters: React.FC<SheltersProps> = ({ sheltersData }) => {
  const [shelterList, setShelterList] = useState<JSX.Element[]>([]);
  const statut = useAppSelector((state) => state.loading.statut);

  useEffect(() => {
    let sortedShelters: JSX.Element[] = [];

    if (sheltersData?.length) {
      sortedShelters = sheltersData
        .sort((a, b) => a.number - b.number)
        .map((shelter) => {
          return (
            <Card key={shelter._id} className={classes.gite}>
              <SheltersItems
                shelterId={shelter._id}
                title={shelter.title}
                number={shelter.number}
              />
            </Card>
          );
        });
    }
    setShelterList(sortedShelters);
  }, [sheltersData]);

  return (
    <section>
      {statut !== HTTPStateKind.ERROR && shelterList?.length > 0 ? (
        shelterList
      ) : (
        <p className="text-center">Les gîtes sont indisponibles.</p>
      )}
    </section>
  );
};

export default Shelters;
