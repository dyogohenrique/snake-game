const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const size = 30;

export const getCanvas = () => canvas;
export const getContext = () => ctx;

export const getSize = () => size;

// Desenha a Grid
export const drawGrid = () => {

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#454545";

    for (let i = 30; i < getCanvas().width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();

        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
    
        ctx.stroke();
    }
}