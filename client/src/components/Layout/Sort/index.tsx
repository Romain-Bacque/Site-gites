import { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "./style.module.css";
// types import
import { SortKind, SortProps } from "./types";

// component
const Sort: React.FC<SortProps> = ({ onSortValidation }) => {
  const [sort, setSort] = useState<SortKind | null>(null);
  const { t } = useTranslation();

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
      <h2 className={classes.sort__title}>{t("sort.title")}</h2>

      <div>
        <h3 className={classes.sort__subtitle}>{t("sort.byDate")}</h3>

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
            {t("sort.ascending")}
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
            {t("sort.descending")}
          </button>
        </div>

        <h3 className={classes.sort__subtitle}>{t("sort.byStatus")}</h3>

        <div>
          <button
            className={`${classes["sort__choice-button"]} ${
              sort === SortKind.STATUS && classes["sort__choice-button--active"]
            }`}
            type="button"
            id={SortKind.STATUS.toString()}
            onClick={handleSortChoice}
          >
            {t("sort.booked")}
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
            {t("sort.awaiting")}
          </button>
        </div>
      </div>

      <button
        className={classes["sort__validation-button"]}
        type="button"
        onClick={handleSortValidation}
      >
        {t("common.validate")}
      </button>
    </div>
  );
};

export default Sort;
