import { useEffect, useState } from "react";

import classes from "./Slider.module.css";
import dataSlider from "./dataSlider";
import BtnSlider from "./BtnSlider";
import { Link } from "react-router-dom";

const Slider = ({ shelter }) => {
  const [slideIndex, setSlideIndex] = useState(1);

  // Naviguer vers la prochaine image du slider
  const handleNextSlide = () => {
    if (slideIndex !== dataSlider[shelter].length) {
      setSlideIndex(slideIndex + 1);
      // Si dernière image du slider est affiché, alors on bascule sur la 1ere
    } else if (slideIndex === dataSlider[shelter].length) {
      setSlideIndex(1);
    }
  };

  // Naviguer vers la précédente image du slider
  const handlePrevSlide = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
      // Si la 1ere image du slider est affiché, alors on bascule sur la dernière
    } else if (slideIndex === 1) {
      setSlideIndex(dataSlider[shelter].length);
    }
  };

  //Animation du slider
  useEffect(() => {
    let sliderAnimation = setInterval(handleNextSlide, 4000);
    return () => {
      clearInterval(sliderAnimation);
    };
  });

  return (
    <div className={classes["container-slider"]}>
      {dataSlider[shelter].map((item, index) => {
        return (
          <div
            key={item.id}
            className={
              slideIndex === index + 1
                ? classes["slide active-anim"]
                : classes["slide"]
            }
          >
            <img
              alt={shelter === 0 ? "photo du gite 1" : "photo du gite 2"}
              className={classes.slide__img}
              src={item.picture}
            />
            <Link to="/albums" className={classes["slider__button-images"]}>
              Voir toutes les images
            </Link>
          </div>
        );
      })}
      <BtnSlider direction={"next"} moveSlide={handleNextSlide} />
      <BtnSlider direction={"prev"} moveSlide={handlePrevSlide} />
    </div>
  );
};

export default Slider;
