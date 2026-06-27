// ─────────────────────────────────────────────
// FILE: src/components/profile/cropImage.js
// Canvas helper: takes a source image + a pixel crop
// area from react-easy-crop and returns a cropped File.
// ─────────────────────────────────────────────

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

/**
 * Crops `imageSrc` to `cropAreaPixels` and returns a square JPEG File.
 * @param {string} imageSrc - data URL or object URL of the source image
 * @param {{x:number,y:number,width:number,height:number}} cropAreaPixels
 * @param {number} outputSize - final width/height in px (square output)
 */
export async function getCroppedImageFile(imageSrc, cropAreaPixels, outputSize = 512) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error("Canvas is empty.")); return; }
        resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  });
}
