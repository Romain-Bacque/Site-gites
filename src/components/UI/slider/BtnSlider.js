import React from "react";
import rightArrow from "./icons/right-arrow.svg";
import leftArrow from "./icons/left-arrow.svg";
import classes from "./Slider.module.css";

const BtnSlider = ({ direction, moveSlide }) => {
  return (
    <button
      onClick={moveSlide}
      className={
        direction === "next"
          ? `${classes["btn-slide"]} ${classes["next"]}`
          : `${classes["btn-slide"]} ${classes["prev"]}`
      }
    >
      <img
        alt={direction === "next" ? "bouton suivant" : "bouton précédent"}
        src={direction === "next" ? rightArrow : leftArrow}
      />
    </button>
  );
};

export default BtnSlider;
