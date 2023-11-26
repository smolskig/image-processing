function debounce(func, timeout = 10) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const brightSlider = document.getElementById("range-bright");

const image = new Image();
image.src = "img.jpg";

image.addEventListener("load", () => {
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  brightSlider.addEventListener(
    "input",
    debounce((e) => {
      ctx.putImageData(applyBright(scannedImage, e.target.value), 0, 0);
    })
  );
});

const applyBright = (scannedImage, brightValue) => {
  let newImage = structuredClone(scannedImage);
  console.log(brightValue)
  for (let i = 0; i < newImage.data.length; i += 4) {
    newImage.data[i] = scannedImage.data[i] + 255 * brightValue;
    newImage.data[i + 1] = scannedImage.data[i + 1] + 255 * brightValue;
    newImage.data[i + 2] = scannedImage.data[i + 2] + 255 * brightValue;
  }

  return newImage;
};
