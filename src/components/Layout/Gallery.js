import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./Gallery.module.css";
import image from "../../img/gite1_large.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

//varialbes ui stocke le nombre de slide par gite qui s'affiche à l'écran
let slidesPerView = 1;

const Gallery = () => {
  const isAuth = useSelector((state) => state.auth.isAuthentificated);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (dimensions.width < 600) {
    slidesPerView = 1;
  } else if (dimensions.width > 600 && dimensions.width < 1250) {
    slidesPerView = 2;
  } else slidesPerView = 3;

  return (
    <>
      {isAuth && <FontAwesomeIcon icon={faPenToSquare} />}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className={classes.swiper}
      >
        <SwiperSlide className={classes.swiper__slide}>
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
        <SwiperSlide>
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
        <SwiperSlide>
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
        <SwiperSlide>
          <img className={classes.image} alt="image" src={image} />
        </SwiperSlide>
        <p className="space" />
      </Swiper>
    </>
  );
};

export default Gallery;
