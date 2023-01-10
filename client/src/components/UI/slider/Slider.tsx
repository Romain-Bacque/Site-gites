import { useEffect, useState } from "react";

import classes from "./Slider.module.css";
import dataSlider from "./dataSlider";
import BtnSlider from "./BtnSlider";
import { Link } from "react-router-dom";

// interfaces
interface SliderProps {
  shelter: number;
}

const Slider: React.FC<SliderProps> = ({ shelter }) => {
  const [slideIndex, setSlideIndex] = useState(1);

  // Navigate to the next image of the slider
  const handleNextSlide = () => {
    if (slideIndex !== dataSlider[shelter].length) {
      setSlideIndex(slideIndex + 1);
      // If the last image of the slider is displayed, then we switch to the 1st
    } else if (slideIndex === dataSlider[shelter].length) {
      setSlideIndex(1);
    }
  };

  // Navigate to the prev image of the slider
  const handlePrevSlide = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
      // If the 1st image of the slider is displayed, then we switch to the last
    } else if (slideIndex === 1) {
      setSlideIndex(dataSlider[shelter].length);
    }
  };

  // Slider animation
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
