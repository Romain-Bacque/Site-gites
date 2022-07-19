import Card from "../UI/Card";

import classes from "./Gites.module.css";
import GitesItems from "./GitesItems";

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();

today = mm + "/" + dd + "/" + yyyy;

const Gites = () => {
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
