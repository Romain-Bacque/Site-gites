import { useEffect, useState } from "react";

import classes from "./Slider.module.css";
import BtnSlider from "./BtnSlider";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

interface SliderProps {
  title: string;
  data:
    | {
        _id: string;
        url: string;
        title: string;
        filename: string;
        shelter_id: string;
      }[]
    | null;
}

const Slider: React.FC<SliderProps> = ({ data }) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const t = useTranslations();

  // Navigate to the next image of the slider
  const handleNextSlide = () => {
    if (slideIndex !== data?.length) {
      setSlideIndex(slideIndex + 1);
      // If the last image of the slider is displayed, then we switch to the 1st
    } else if (slideIndex === data?.length) {
      setSlideIndex(1);
    }
  };

  // Navigate to the prev image of the slider
  const handlePrevSlide = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
      // If the 1st image of the slider is displayed, then we switch to the last
    } else if (slideIndex === 1) {
      setSlideIndex(data?.length ?? 1);
    }
  };

  // Slider animation
  useEffect(() => {
    const sliderAnimation = setInterval(handleNextSlide, 4000);

    return () => {
      clearInterval(sliderAnimation);
    };
  });

  return (
    <div className={classes["container-slider"]}>
      {data?.map((item, index) => {
        return (
          <div
            key={item._id}
            className={
              slideIndex === index + 1
                ? `${classes["slide--active-anim"]} ${classes.slide}`
                : classes.slide
            }
          >
            <Image
              alt={item.filename ? item.filename : "Image de l'hébergement"}
              className={classes.slide__img}
              src={item.url}
              width={800}
              height={600}
            />
            <Link
              href={`/albums/${item.shelter_id}`}
              className={classes["slider__button-img"]}
            >
              {t("slider.link")}
            </Link>
          </div>
        );
      })}
      {data && data.length > 1 && (
        <>
          <BtnSlider direction={"next"} moveSlide={handleNextSlide} />
          <BtnSlider direction={"prev"} moveSlide={handlePrevSlide} />
        </>
      )}
    </div>
  );
};

export default Slider;
