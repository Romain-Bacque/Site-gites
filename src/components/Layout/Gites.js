import { useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { getShelter } from "../../lib/api";
import Card from "../UI/Card";

import classes from "./Gites.module.css";
import GitesItems from "./GitesItems";

const dd = String(today.getDate()).padStart(2, "0"),
  mm = String(today.getMonth() + 1).padStart(2, "0"),
  yyyy = today.getFullYear(),
  today = new Date(mm + "/" + dd + "/" + yyyy);

const Gites = () => {
  const { sendHttpRequest: sendShelterHttpRequest, data: shelterAccessDatas } =
    useHttp(getShelter);

  useEffect(() => {
    sendShelterHttpRequest();
  }, [sendHttpRequest, isAuth]);

  return (
    <>
      <section>
        <Card className={classes.gite}>
          <GitesItems shelter={0} smallImgIndex={0} largeImgIndex={1} />
        </Card>
      </section>
      <section>
        <Card className={classes.gite}>
          <GitesItems shelter={1} smallImgIndex={2} largeImgIndex={3} />
        </Card>
      </section>
    </>
  );
};

export default Gites;
