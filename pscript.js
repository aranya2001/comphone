const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('file-input');
const cropBtn = document.getElementById('crop-btn');
const resizeBtn = document.getElementById('resize-btn');
const filterSelect = document.getElementById('filter-select');
const saveBtn = document.getElementById('save-btn');

const ctx = canvas.getContext('2d');

let image = null;

// Event listener for file input
fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
});

// Event listener for brightness slider
document.getElementById('brightness').addEventListener('input', () => {
    if (!image) return;
    const brightness = Number(document.getElementById('brightness').value);
    applyFilter(brightness, 'brightness');
});

// Event listener for contrast slider
document.getElementById('contrast').addEventListener('input', () => {
    if (!image) return;
    const contrast = Number(document.getElementById('contrast').value);
    applyFilter(contrast, 'contrast');
});

// Event listener for crop button
cropBtn.addEventListener('click', () => {
    if (!image) return;
    const width = canvas.width / 2;
    const height = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(image, 0, 0, 0, 0, width, height);
    image = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Event listener for resize button
resizeBtn.addEventListener('click', () => {
    if (!image) return;
    const width = canvas.width * 2;
    const height = canvas.height * 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(image, 0, 0);
    image = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Event listener for filter select
filterSelect.addEventListener('change', () => {
    if (!image) return;
    const filter = filterSelect.value;
    switch (filter) {
        case 'grayscale':
            applyFilter(1, 'grayscale');
            break;
        case 'sepia':
            applyFilter(1, 'sepia');
            break;
        case 'blur':
            applyFilter(1, 'blur');
            break;
        default:
            ctx.putImageData(image, 0, 0);
            break;
    }
});

// Event listener for save button
saveBtn.addEventListener('click', () => {
    if (!image) return;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Helper function to apply filters
function applyFilter(value, type) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        switch (type) {
            case 'brightness':
                r += value;
                g += value;
                                b += value;
                break;
            case 'contrast':
                r = (value * (r - 128)) + 128;
                g = (value * (g - 128)) + 128;
                b = (value * (b - 128)) + 128;
                break;
            case 'grayscale':
                const gray = (r + g + b) / 3;
                r = gray;
                g = gray;
                b = gray;
                break;
            case 'sepia':
                const grayValue = (r + g + b) / 3;
                r = Math.min(255, (grayValue + 40));
                g = Math.min(255, (grayValue + 20));
                b = Math.min(255, grayValue);
                break;
            case 'blur':
                const sum = [0, 0, 0];
                let count = 0;
                for (let x = -5; x <= 5; x++) {
                    for (let y = -5; y <= 5; y++) {
                        const pixelIndex = ((canvas.width * (y + imageData.height)) + (x + imageData.width)) * 4;
                        if (data[pixelIndex] !== undefined) {
                            sum[0] += data[pixelIndex];
                            sum[1] += data[pixelIndex + 1];
                            sum[2] += data[pixelIndex + 2];
                            count++;
                        }
                    }
                }
                r = Math.round(sum[0] / count);
                g = Math.round(sum[1] / count);
                b = Math.round(sum[2] / count);
                break;
            default:
                break;
        }
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }
    ctx.putImageData(imageData, 0, 0);
    image = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
