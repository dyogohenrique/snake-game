const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final--score > span");
const menu = document.querySelector('.menu--screen');
const buttonReplay = document.querySelector('.btn--replay');

const pointAudio = new Audio('../assets/point.wav');
const loserAudio = new Audio('../assets/loser.wav')

const size = 30;

const initialPosition = {x: 270, y: 240}

let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas. width - size);

    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(70, 220);
    const green = randomNumber(70, 220);
    const blue = randomNumber(70, 220);

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId;

const drawFood = () => {

    const {x, y, color} = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

const drawSnake = () => {
    const border = 3;

    snake.forEach((position, index) => {
        // Desenha o corpo da cobra
        if (index < snake.length - 1) {
            ctx.fillStyle = "#2fa12f"; 
            ctx.fillRect(position.x, position.y, size, size);

            // Desenha a borda do corpo da cobra
            ctx.fillStyle = "#237323"; 
            ctx.fillRect(
                position.x + border,
                position.y + border, 
                size - border * 2,
                size - border * 2 
            );
        } else {
            // Desenha a cabeça da cobra
            ctx.fillStyle = "#2fa12f";
            ctx.fillRect(position.x, position.y, size, size);
        }
    });
}



const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    
    if (direction == "right") {
        snake.push({x: head.x + size, y: head.y})
    }

    if (direction == "left") {
        snake.push({x: head.x - size, y: head.y})
    }   

    if (direction == "down") {
        snake.push({x: head.x, y: head.y + size})
    }   

    if (direction == "up") {
        snake.push({x: head.x, y: head.y - size})
    }   

    snake.shift();
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#454545";

    for (let i = 30; i < canvas.width; i += 30) {
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

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        incrementScore();
        snake.push(head);
        pointAudio.play();

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
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    })

    if (wallCollision || selfCollision) {
        loserAudio.play();
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined

    snake = [initialPosition];

    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

let speed = 300;

const gameLoop = () => {
    console.log(food.x, food.y);

    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600);
    
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
    canvas.style.filter = "none";
    speed = 300;
})
