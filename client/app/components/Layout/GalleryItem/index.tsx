import Card from "../../../components/UI/Card";
import { FC, useState } from "react";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../../../hooks/use-store";
import {
  faAdd,
  faTrash,
  faTimes,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { ImageNotSupported } from "@mui/icons-material";
import { GalleryItemProps } from "./types";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = useTranslations();

  const sortedImages =
    images?.length > 0
      ? [...images].sort((a) => (a._id === mainImgId ? -1 : 1))
      : [];

  const handleFileValueChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
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

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length,
    );
  };

  return (
    <Card className={classes.album}>
      <div className="button-container button-container--alt">
        <h3 className={classes["album-title"]}>{title}</h3>
        {isAuth && (
          <div>
            <label
              htmlFor={`files-shelter${title}`}
              className={`button button--alt`}
              style={{
                pointerEvents: isPending ? "none" : "auto",
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {t("gallery.addPhoto")}
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
        )}
      </div>

      <div className={classes["mosaic-container"]}>
        {sortedImages.length > 0 ? (
          sortedImages.map((image, index) => (
            <div key={image._id} className={classes["mosaic-item"]}>
              <div className={classes["image-wrapper"]}>
                <Image
                  src={image.url}
                  alt={image.filename}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className={classes["mosaic-image"]}
                  onClick={() => openLightbox(index)}
                  priority={image._id === mainImgId}
                />
              </div>

              {isAuth && (
                <div className={classes["image-controls"]}>
                  <button
                    data-image-id={image._id}
                    onClick={onImageDelete}
                    className={classes["control-btn"]}
                    title={t("gallery.deleteImage")}
                    disabled={isPending}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>

                  {image._id !== mainImgId && (
                    <button
                      data-image-id={image._id}
                      onClick={onMainImageSet}
                      className={classes["control-btn"]}
                      title={t("gallery.setMainImage")}
                      disabled={isPending}
                    >
                      ⭐
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center space">
            <ImageNotSupported sx={{ fontSize: "5rem", color: "#bbb" }} />
            <p>{t("gallery.noImage")}</p>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className={classes.lightbox} onClick={closeLightbox}>
          <button className={classes["lightbox-close"]} onClick={closeLightbox}>
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <button
            className={classes["lightbox-prev"]}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <button
            className={classes["lightbox-next"]}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          <div
            className={classes["lightbox-image-wrapper"]}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sortedImages[currentImageIndex]?.url || ""}
              alt={sortedImages[currentImageIndex]?.filename || ""}
              fill
              sizes="90vw"
              priority
              className={classes["lightbox-image"]}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default GalleryItem;
