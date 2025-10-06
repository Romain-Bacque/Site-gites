import { v4 as uuidv4 } from "uuid";
import { ActivitiesProps } from "./types";
import classes from "./style.module.css";
import Modal from "../../../components/UI/Modal";
import { HTTPStateKind } from "../../../global/types";

// Component
const Activities: React.FC<ActivitiesProps> = ({
  httpStatut,
  onHide,
  showModal,
  activities,
}) => {
  return (
    <Modal
      show={showModal}
      onHide={onHide}
    >
      <div className={classes["activities-list-container"]}>
        <h3>Activités dans le couserans</h3>
        {httpStatut === HTTPStateKind.PENDING ? (
          <p className="text-center">Chargement des activités...</p>
        ) : activities?.length ? (
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
                    rel="noreferrer"
                  >
                    Lien vers la source
                  </a>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-center space">Aucune activité à afficher.</p>
        )}
      </div>
    </Modal>
  );
};

export default Activities;
