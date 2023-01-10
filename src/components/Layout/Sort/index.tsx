import { useState } from "react";
import classes from "./style.module.css";
// types import
import { SortKind, SortProps } from "./types";

// component
const Sort: React.FC<SortProps> = ({ onSortValidation }) => {
  const [sort, setSort] = useState<SortKind | null>(null);

  const handleSortChoice = (event: React.MouseEvent) => {
    event.stopPropagation();

    const chosenFilter =
      "id" in event.target && typeof event.target.id === "string"
        ? +event.target.id
        : null;

    setSort(chosenFilter);
  };
  const handleSortValidation = (event: React.MouseEvent) => {
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
              sort === SortKind.DATE_INCREASING &&
              classes["sort__choice-button--active"]
            }`}
            type="button"
            id={SortKind.DATE_INCREASING.toString()}
            onClick={handleSortChoice}
          >
            Croissant
          </button>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === SortKind.DATE_DECREASING &&
              classes["sort__choice-button--active"]
            }`}
            type="button"
            id={SortKind.DATE_DECREASING.toString()}
            onClick={handleSortChoice}
          >
            Décroissant
          </button>
        </div>
        <h3 className={classes.sort__subtitle}>Par Statut</h3>
        <div>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === SortKind.BOOKED && classes["sort__choice-button--active"]
            }`}
            type="button"
            id={SortKind.BOOKED.toString()}
            onClick={handleSortChoice}
          >
            Réservé
          </button>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === SortKind.AWAITING &&
              classes["sort__choice-button--active"]
            }`}
            type="button"
            id={SortKind.AWAITING.toString()}
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
