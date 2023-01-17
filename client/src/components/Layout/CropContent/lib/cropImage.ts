import { Area } from "react-easy-crop";

export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default async function getCroppedImg(url: string, pixelCrop: Area) {
  const image = await createImage(url);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = image.height;
  canvas.height = image.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    image.width,
    image.height
  );

  return new Promise<Blob | null>((resolve, _) => {
    // BLOB stands for a “Binary Large Object,” a data type that stores binary data.
    // Binary Large Objects (BLOBs) can be complex files like images or videos, unlike other data strings that only store letters and numbers.
    // A BLOB will hold multimedia objects to add to a database; however, not all databases support BLOB storage.
    canvas.toBlob((file) => {
      // file.name = "cropped.jpeg";
      resolve(file);
    }, "image/jpeg");
  });
}
