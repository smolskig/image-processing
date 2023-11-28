const debounce = (func, timeout = 25) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const sliders = document.querySelectorAll("input[type=range]");

//adjust
const brightSlider = document.getElementById("range-bright");

//color
const redSlider = document.getElementById("range-red");
const greenSlider = document.getElementById("range-green");
const blueSlider = document.getElementById("range-blue");

const needsUpdate = {
  red: false,
  blue: false,
  green: false,
  brightness: false,
};

const canvasHistory = {
  red: null,
  blue: null,
  green: null,
  brightness: null,
};

const image = new Image();
image.src = "img.jpg";

image.addEventListener("load", () => {
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  //get loaded image data
  let scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const applyModifications = () => {
    let newImage = structuredClone(scannedImage);

    for (let i = 0; i < newImage.data.length; i += 4) {
      const red = i;
      const green = i + 1;
      const blue = i + 2;

      //rgb transformation
      applyTransformation(newImage, { red }, redSlider.value);
      applyTransformation(newImage, { green }, greenSlider.value);
      applyTransformation(newImage, { blue }, blueSlider.value);

      //bright
      applyTransformation(newImage, { red, green, blue }, brightSlider.value);
    }

    ctx.putImageData(newImage, 0, 0);
  };

  const applyTransformation = (newImage, rgb, multiplier) => {
    const { red, green, blue } = rgb;

    if (red) {
      newImage.data[red] = newImage.data[red] + 255 * multiplier;
    }

    if (green) {
      newImage.data[green] = newImage.data[green] + 255 * multiplier;
    }

    if (blue) {
      newImage.data[blue] = newImage.data[blue] + 255 * multiplier;
    }
  };
  
  sliders.forEach((slider) => {
    slider.addEventListener(
      "input",
      debounce((e) => {
        applyModifications();
      })
    );

    slider.addEventListener("dblclick", (e) => {
      e.target.value = 0;
      applyModifications();
    });
  });
});
