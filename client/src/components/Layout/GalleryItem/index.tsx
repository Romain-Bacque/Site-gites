import Card from "../../../components/UI/Card";
import { FC } from "react";
import classes from "./style.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../../../hooks/use-store";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

// I need to import the css here to make the swiper work correctly, because it's not imported globally in the app
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { ImageNotSupported } from "@mui/icons-material";
import { GalleryItemProps } from "./types";

const GalleryItem: FC<GalleryItemProps> = ({
  id,
  mainImgId,
  title,
  images,
  onSetUrlFile,
  onImageDelete,
  onMainImageSet,
  isPending,
  setShowModal,
}) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthentificated);

  const handleFileValueChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.files && event.target.files[0]) {
      onSetUrlFile({
        id,
        file: URL.createObjectURL(event.target.files[0]),
      });
      event.target.value = "";
      setShowModal({
        show: true,
        crop: true,
        deleteAlert: false,
      });
    }
  };

  return (
    <Card className={classes.album}>
      <div className="button-container button-container--alt">
        <h3 className={classes["album-title"]}>{title}</h3>
        {isAuth ? (
          <div>
            <label
              htmlFor={`files-shelter${title}`}
              className={`button button--alt`}
              style={{
                pointerEvents: isPending ? "none" : "auto",
                opacity: isPending ? 0.6 : 1,
              }}
            >
              Ajouter une photo
              <FontAwesomeIcon className="button__icon" icon={faAdd} />
            </label>
            <input
              id={`files-shelter${title}`}
              style={{ display: "none" }}
              type="file"
              name="file"
              onChange={handleFileValueChange}
              accept="image/*"
              disabled={isPending}
            />
          </div>
        ) : null}
      </div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        centeredSlides
        slidesPerView="auto"
        navigation
        pagination={{ clickable: true }}
        className={classes.swiper}
      >
        {images?.length > 0 ? (
          images
            .sort((a) => (a._id === mainImgId ? -1 : 1))
            .map((image) => (
              <SwiperSlide key={image._id} className={classes.swiper__slide}>
                {isAuth && (
                  <button
                    data-image-id={image._id}
                    onClick={onImageDelete}
                    className={classes.swiper__icon}
                    title="Supprimer l'image"
                    disabled={isPending}
                  >
                    <FontAwesomeIcon
                      className={classes["delete-icon"]}
                      style={{ pointerEvents: "none" }}
                      icon={faTrash}
                    />
                  </button>
                )}
                {isAuth && image._id !== mainImgId && (
                  <button
                    data-image-id={image._id}
                    onClick={onMainImageSet}
                    className={classes.swiper__mainImgBtn}
                    title="Définir comme image principale"
                    disabled={isPending}
                  >
                    Définir comme image principale
                  </button>
                )}
                <img
                  className={classes.image}
                  alt={image.filename}
                  src={image.url}
                />
              </SwiperSlide>
            ))
        ) : (
          <div className="text-center space">
            <ImageNotSupported sx={{ fontSize: "5rem", color: "#bbb" }} />
            <p>Aucune image pour le moment.</p>
          </div>
        )}
      </Swiper>
    </Card>
  );
};

export default GalleryItem;
