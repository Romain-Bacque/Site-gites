// other import
import { v4 as uuidv4 } from "uuid";
import { ActivitiesProps } from "./types";
import classes from "./style.module.css";

// Component
const Activities: React.FC<ActivitiesProps> = ({ activities }) => {
  return activities?.length ? (
    <ul className={classes["activities-list"]}>
      {activities
        .sort((a, b) => {
          if (a.address < b.address) {
            return -1;
          }
          if (a.address > b.address) {
            return 1;
          }
          return 0;
        })
        .map((activity) => (
          <li className={classes["activities-list__item"]} key={uuidv4()}>
            <h4 className={classes["activities-list__title"]}>
              {activity.title}
            </h4>
            <p className={classes["activities-list__city"]}>
              Commune : {activity.address}
            </p>
            <a
              target="_blank"
              className={classes["activities-list__link"]}
              href={activity.link}
            >
              Lien vers la source
            </a>
          </li>
        ))}
    </ul>
  ) : (
    <p>Aucune activité à afficher.</p>
  );
};

export default Activities;
