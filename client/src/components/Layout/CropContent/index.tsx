import React, { MouseEventHandler, useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import classes from "./style.module.css";
import getCroppedImg from "./lib/cropImage";
// types import
import { CropContentProps } from "./types";
import useHTTPState from "../../../hooks/use-http-state";

const CropContent: React.FC<CropContentProps> = ({
  shelterId,
  url,
  onImagePost,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const handleHTTPState = useHTTPState();

  const cropDatasRef = useRef<[string, Area] | null>(null);

  const handleCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      cropDatasRef.current = [url, croppedAreaPixels];
    },
    [url]
  );

  const handleCropImage: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    if (!cropDatasRef.current) return;

    const [imageSrc, croppedAreaPixels] = cropDatasRef.current;

    try {
      handleHTTPState("pending");

      const file = await getCroppedImg(imageSrc, croppedAreaPixels);

      const formData = new FormData();

      formData.append("shelterId", shelterId);
      formData.append("file", file!);

      onImagePost(formData);
    } catch (err: any) {
      handleHTTPState("error", err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <div
      className={classes["crop-container"]}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={classes["crop-container__cropper"]}>
        <Cropper
          image={url}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          aspect={4 / 3}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <form className={classes["crop-container__form"]}>
        <div>
          <span className={classes["crop-container__span"]}>-</span>
          <input
            className={classes["crop-container__input"]}
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={zoom}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setZoom(+event.target.value)
            }
          />
          <span className={classes["crop-container__span"]}>+</span>
        </div>
        <button
          type="button"
          onClick={handleCropImage}
          className={classes["crop-container__button"]}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default CropContent;
