import React, { MouseEventHandler, useRef } from "react";
import { Cropper, CropperRef, RectangleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import classes from "./style.module.css";
import { CropContentProps } from "./types";
import useHTTPState from "../../../hooks/use-http-state";
import { useTranslation } from "react-i18next";

const CropContent: React.FC<CropContentProps> = ({
  shelterId,
  url,
  onImagePost,
}) => {
  const cropperRef = useRef<CropperRef>(null);
  const handleHTTPState = useHTTPState();
  const { t } = useTranslation();

  const handleCropImage: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    const cropper = cropperRef.current;
    if (!cropper) return;

    try {
      handleHTTPState("pending");

      const canvas = cropper.getCanvas();
      if (!canvas) throw new Error(t("cropImage.canvasError"));

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg")
      );

      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("shelterId", shelterId);
      formData.append("file", file);

      onImagePost(formData);
    } catch (err: any) {
      handleHTTPState("error", err?.message ?? t("cropImage.error"));
    }
  };

  return (
    <div
      className={classes["crop-container"]}
      onClick={(e) => e.stopPropagation()}
    >
      <Cropper
        className={classes["crop-container__cropper"]}
        ref={cropperRef}
        src={url}
        stencilComponent={RectangleStencil}
        aspectRatio={undefined}
      />

      <form className={classes["crop-container__form"]}>
        <button
          type="button"
          onClick={handleCropImage}
          className={classes["crop-container__button"]}
        >
          {t("cropImage.save")}
        </button>
      </form>
    </div>
  );
};

export default CropContent;
