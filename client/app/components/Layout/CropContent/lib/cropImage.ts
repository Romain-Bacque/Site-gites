import { Area } from "react-easy-crop";

export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default async function getCroppedImg(
  url: string,
  croppedAreaPixels: Area
) {
  const image = await createImage(url);

  const canvas = document.createElement("canvas");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.drawImage(
    image,
    // source position
    croppedAreaPixels.x, // top-left x
    croppedAreaPixels.y, // top-left y
    croppedAreaPixels.width, // source width
    croppedAreaPixels.height, // source height
    // destination position
    0, // top-left x
    0, // top-left y
    canvas.width, // destination width
    canvas.height // destination height
  );

  return new Promise<Blob | null>((resolve) => {
    // BLOB stands for a “Binary Large Object,” a data type that stores binary data.
    // Binary Large Objects (BLOBs) can be complex files like images or videos, unlike other data strings that only store letters and numbers.
    // A BLOB will hold multimedia objects to add to a database; however, not all databases support BLOB storage.
    canvas.toBlob((file) => {
      // file.name = "cropped.jpeg";
      resolve(file);
    }, "image/jpeg");
  });
}
