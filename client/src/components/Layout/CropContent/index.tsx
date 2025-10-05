import { useAppDispatch } from "../../../hooks/use-store";
import React, { MouseEventHandler, useCallback, useState } from "react";

import Cropper, { Area } from "react-easy-crop";
import classes from "./style.module.css";
import getCroppedImg from "./lib/cropImage";
// types import
import { CropContentProps } from "./types";
import { loadingActions } from "../../../store/loading";
import { HTTPStateKind } from "../../../global/types";
import useHTTPState from "../../../hooks/use-http-state";

let cropDatas: [string, Area];

// component
const CropContent: React.FC<CropContentProps> = ({
  shelterId,
  url,
  onImagePost,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const dispatch = useAppDispatch();
  const handleHTTPState = useHTTPState();

  const handleCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      cropDatas = [url, croppedAreaPixels];
    },
    [url]
  );

  const handleCropImage: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    try {
      dispatch(loadingActions.setStatut(HTTPStateKind.PENDING));

      const file = await getCroppedImg(cropDatas[0], cropDatas[1]);

      dispatch(loadingActions.setStatut(HTTPStateKind.SUCCESS));

      const formData = new FormData();
      formData.append("shelterId", shelterId);
      formData.append("file", file!);

      onImagePost(formData);
    } catch (err: any) {
      handleHTTPState(HTTPStateKind.ERROR, err);
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
          aspect={4 / 3}
          onCropChange={setCrop}
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
