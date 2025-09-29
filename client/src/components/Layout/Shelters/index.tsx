// hooks import
import { useState, useEffect } from "react";
// components import
import Card from "../../UI/Card";
import classes from "./style.module.css";
import ShelterItem from "../ShelterItem";
// types import
import { SheltersProps } from "./types";

// component
const Shelters: React.FC<SheltersProps> = ({ sheltersData }) => {
  const [shelterList, setShelterList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let sortedShelters: JSX.Element[] = [];

    if (sheltersData?.length) {
      sortedShelters = sheltersData.map((shelter) => {
        return (
          <Card key={shelter._id} className={classes.gite}>
            <ShelterItem
              shelterId={shelter._id}
              title={shelter.title}
              pictures={shelter.images}
            />
          </Card>
        );
      });
    }
    setShelterList(sortedShelters);
  }, [sheltersData]);

  return (
    <section>
      {shelterList?.length > 0 ? (
        shelterList
      ) : (
        <p className="text-center">Les gîtes sont indisponibles.</p>
      )}
    </section>
  );
};

export default Shelters;
