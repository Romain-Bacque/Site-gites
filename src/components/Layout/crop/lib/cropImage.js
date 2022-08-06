export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default async function getCroppedImg(url, pixelCrop) {
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

  return new Promise((resolve, _) => {
    canvas.toBlob((file) => {
      file.name = "cropped.jpeg";
      resolve(file);
    }, "image/jpeg");
  });
}
