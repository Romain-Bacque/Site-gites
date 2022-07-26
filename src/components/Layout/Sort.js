import { useState } from "react";
import classes from "./Sort.module.css";

const Sort = ({ onSortValidation }) => {
  const [sort, setSort] = useState(null);

  const handleSortChoice = (event) => {
    event.stopPropagation();
    setSort(event.target.id);
  };
  const handleSortValidation = (event) => {
    event.stopPropagation();
    onSortValidation(sort);
  };

  window.addEventListener("click", () => {
    setSort(null);
  });

  return (
    <div className={classes.sort}>
      <h2 className={classes.sort__title}>Trier</h2>
      <div>
        <h3 className={classes.sort__subtitle}>Par Dates</h3>
        <div>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === "dateIncreasing" &&
              classes["sort__choice-button--active"]
            }`}
            type="button"
            id="dateIncreasing"
            onClick={handleSortChoice}
          >
            Croissant
          </button>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === "dateDecreasing" &&
              classes["sort__choice-button--active"]
            }`}
            type="button"
            id="dateDecreasing"
            onClick={handleSortChoice}
          >
            Décroissant
          </button>
        </div>
        <h3 className={classes.sort__subtitle}>Par Statut</h3>
        <div>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === "booked" && classes["sort__choice-button--active"]
            }`}
            type="button"
            id="booked"
            onClick={handleSortChoice}
          >
            Réservé
          </button>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === "awaiting" && classes["sort__choice-button--active"]
            }`}
            type="button"
            id="awaiting"
            onClick={handleSortChoice}
          >
            En attente
          </button>
        </div>
      </div>
      <button
        className={classes["sort__validation-button"]}
        type="button"
        onClick={handleSortValidation}
      >
        Valider
      </button>
    </div>
  );
};

export default Sort;
