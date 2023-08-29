const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let erasing = false;
let currentColor = 'black';
let cursorX, cursorY;


canvas.width = 1400;
canvas.height = 800;


const cursor = document.getElementById('cursor');


function setTool(tool) {
    if (tool === 'eraser') {
        erasing = true;
        currentColor = 'white'; 
        cursor.style.backgroundColor = 'white'; 
    } else {
        erasing = false;
        currentColor = tool;
        cursor.style.backgroundColor = currentColor;
    }
}

function startPosition(e) {
    painting = true;
    setCursorPosition(e);
    draw();
}   

function endPosition() {
    painting = false;
    ctx.beginPath();
    
    saveDrawing();
}


const thicknessInput = document.getElementById("thickness");


let currentThickness = parseInt(thicknessInput.value);

thicknessInput.addEventListener("input", () => {
    currentThickness = parseInt(thicknessInput.value);
});
 
function draw() {
    if (!painting) return;

    ctx.lineWidth = currentThickness; 
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(cursorX, cursorY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cursorX, cursorY);
}



function setCursorPosition(e) {
    const canvasBounds = canvas.getBoundingClientRect();
    cursorX = e.clientX - canvasBounds.left;
    cursorY = e.clientY - canvasBounds.top;
}


canvas.addEventListener('mousedown', (e) => {
    setCursorPosition(e);
    startPosition(e);
});
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', (e) => {
    setCursorPosition(e);
    draw();
});


canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    setCursorPosition(e.touches[0]);
    startPosition(e.touches[0]);
});
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    setCursorPosition(e.touches[0]);
    draw();
});


window.addEventListener('resize', () => {
    const savedDrawing = getSavedDrawing();
    canvas.width = 1000;
    canvas.height = 1000;
    redrawDrawing(savedDrawing);
});

const colorButtons = document.querySelectorAll('.color-button');
colorButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedColor = button.getAttribute('data-color');
        setTool(selectedColor);
    });
});


const eraserButton = document.getElementById('eraser-button');
eraserButton.addEventListener('click', () => {
    if (erasing) {
        setTool(''); 
    } else {
        setTool('eraser');
    }
});


const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    saveCanvasAsImage();
});

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('drawing'); 
});


const painterButton = document.getElementById('painter-button');
painterButton.addEventListener('click', () => {
    setTool('black'); 
});


function saveDrawing() {
    localStorage.setItem('drawing', canvas.toDataURL());
}

function getSavedDrawing() {
    return localStorage.getItem('drawing');
}

function redrawDrawing(savedDrawing) {
    if (savedDrawing) {
        const image = new Image();
        image.src = savedDrawing;
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
        };
    }
}


function saveCanvasAsImage() {
    const canvasImage = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = canvasImage;
    a.download = 'drawing.png'; 
    a.click();
}
