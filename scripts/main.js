import { playLoser, playPoint } from "./audio.js";
import { drawGrid, getCanvas, getContext, getSize } from "./canva.js";


const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final--score > span");
const menu = document.querySelector('.menu--screen');
const buttonReplay = document.querySelector('.btn--replay');

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, getCanvas().width - getSize());

    return Math.round(number / 30) * 30;
}

const randomColor = () => {
    const red = randomNumber(70, 220);
    const green = randomNumber(70, 220);
    const blue = randomNumber(70, 220);

    return `rgb(${red}, ${green}, ${blue})`;
}

const initialPosition = {x: 270, y: 240}

let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = + score.innerText + 10;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId;

const drawFood = () => {

    const {x, y, color} = food;

    getContext().shadowColor = color;
    getContext().shadowBlur = 30;
    getContext().fillStyle = color;
    getContext().fillRect(x, y, getSize(), getSize());
    getContext().shadowBlur = 0;
}

const drawSnake = () => {
    const border = 3;

    snake.forEach((position, index) => {
        // Desenha o corpo da cobra
        if (index < snake.length - 1) {
            getContext().fillStyle = "#2fa12f"; 
            getContext().fillRect(position.x, position.y, getSize(), getSize());

            // Desenha a borda do corpo da cobra
            getContext().fillStyle = "#237323"; 
            getContext().fillRect(
                position.x + border,
                position.y + border, 
                getSize() - border * 2,
                getSize() - border * 2 
            );
        } else {
            // Desenha a cabeça da cobra
            getContext().fillStyle = "#2fa12f";
            getContext().fillRect(position.x, position.y, getSize(), getSize());
        }
    });
}

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    
    if (direction == "right") {
        snake.push({x: head.x + getSize(), y: head.y})
    }

    if (direction == "left") {
        snake.push({x: head.x - getSize(), y: head.y})
    }   

    if (direction == "down") {
        snake.push({x: head.x, y: head.y + getSize()})
    }   

    if (direction == "up") {
        snake.push({x: head.x, y: head.y - getSize()})
    }   

    snake.shift();
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        incrementScore();
        snake.push(head);
        playPoint();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();


        // Aumenta a velocidade a cada 50 pontos
        if (+score.innerText % 50 === 0) {
            speed -= 10;
        }
        
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = getCanvas().width - getSize();
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    })

    if (wallCollision || selfCollision) {
        playLoser();
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined

    snake = [initialPosition];

    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    getCanvas().style.filter = "blur(2px)";
}

let speed = 300;

const gameLoop = () => {
    clearInterval(loopId)
    getContext().clearRect(0, 0, 600, 600);
    
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, speed);
}

gameLoop();

document.addEventListener("keydown", ({ key }) => {

    if (key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }
    
    if (key == "ArrowDown" && direction != "up"){
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down"){
        direction = "up"
    }
});

buttonReplay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    getCanvas().style.filter = "none";
    
    speed = 300;
});
