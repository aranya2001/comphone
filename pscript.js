const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("file-input");
const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");
const saveBtn = document.getElementById("save-btn");

let history = [];
let current = -1;

function loadImage(url) {
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = url;
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const url = reader.result;
    loadImage(url);
    history.push(url);
    current++;
  };
});

undoBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    loadImage(history[current]);
  }
});

redoBtn.addEventListener("click", () => {
  if (current < history.length - 1) {
    current++;
    loadImage(history[current]);
  }
});

saveBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "image.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
