import React from "react";
import classes from "./Slider.module.css";
import rightArrow from "./icons/right-arrow.svg";
import leftArrow from "./icons/left-arrow.svg";
import Image from "next/image";

// interfaces
interface BtnSliderProps {
  direction: "next" | "prev";
  moveSlide: () => void;
}

const BtnSlider: React.FC<BtnSliderProps> = ({ direction, moveSlide }) => {
  return (
    <button
      type="button"
      onClick={moveSlide}
      className={
        direction === "next"
          ? `${classes["btn-slide"]} ${classes["next"]}`
          : `${classes["btn-slide"]} ${classes["prev"]}`
      }
    >
      <Image
        alt={direction === "next" ? "bouton suivant" : "bouton précédent"}
        src={direction === "next" ? rightArrow : leftArrow}
        width={24}
        height={24}
      />
    </button>
  );
};

export default BtnSlider;
