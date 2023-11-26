function debounce(func, timeout = 25) {
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

  //get loaded image data
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  brightSlider.addEventListener(
    "input",
    debounce((e) => {
      const newImage = applyBright(scannedImage, e.target.value);

      //updating image with new processing
      ctx.putImageData(newImage, 0, 0);
    })
  );
});

const applyBright = (scannedImage, brightValue) => {
  let newImage = structuredClone(scannedImage);

  for (let i = 0; i < newImage.data.length; i += 4) {
    const redIndex = i;
    const greenIndex = i + 1;
    const blueIndex = i + 2;

    //changing RGB colors to a range between -255 and 255 based on the value of the slider
    newImage.data[redIndex] = scannedImage.data[redIndex] + 255 * brightValue;
    newImage.data[greenIndex] = scannedImage.data[greenIndex] + 255 * brightValue;
    newImage.data[blueIndex] = scannedImage.data[blueIndex] + 255 * brightValue;
  }

  return newImage;
};
