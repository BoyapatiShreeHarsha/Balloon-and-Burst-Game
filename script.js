let gameContainer = document.querySelector(".game-container");

let pumpHandle = document.querySelector(".pump-handle-img");
let pumpBody = document.querySelector(".pump-body-img");
let pumpTail = document.querySelector(".pump-body-img-tail");
let isPumping = false;

let balloonContainer = document.querySelector(".balloons-container");
let count = 0;

let positions = [
    { top: 55, left: 75 },
    { top: 35, left: 70 },
    { top: 25, left: 65 },
    { top: 17, left: 55 },
    { top: 13, left: 35 },
    { top: 9, left: 25 },
    { top: 5, left: 5 },
    { top: -10, left: -10 },
];


// for find Score

let timer = document.querySelector(".timer").lastElementChild;
let score = document.querySelector(".present_score").lastElementChild;
let highscore = document.querySelector(".HighScore").lastElementChild;


let flag = 0;

let Score = () => {
    if (localStorage.getItem("highScore") === null) {
        localStorage.setItem("highScore", "0");
        highscore.innerHTML = "0";
        score.innerHTML = "0";
        timer.innerHTML = "0";
    }

    if (localStorage.getItem("highScore") !== null && flag === 0) {
        highscore.innerHTML = localStorage.getItem("highScore");
        console.log("emtered");
        score.innerHTML = "0";
        timer.innerHTML = "30";
        console.log(timer.innerHTML);
        flag++;
    }

    if (flag > 1) {
        timer.innerHTML = (parseInt(timer.innerHTML) - 1).toString();
        if (timer.innerHTML === "0") {
            highscore.innerHTML = Math.max(parseInt(score.innerHTML), parseInt(highscore.innerHTML)).toString();
            localStorage.setItem("highScore", highscore.innerHTML);
            location.reload();
        }
        else {
            setTimeout(Score, 1000);
        }
    }
}

Score();


let calculateBalloonContainerPosition = (count) => {
    let pump = document.querySelector(".pump-body-img-tail");
    let pumpRect = pump.getBoundingClientRect();

    let pumpTop = pumpRect.top;
    let pumpLeft = pumpRect.left;
    let pumpWidth = pumpRect.width;
    let balloonContainerTop;
    let balloonContainerLeft;
    if (count == 2) {
        balloonContainerTop = pumpTop - pumpRect.height / 2;
        balloonContainerLeft = pumpLeft;
    }
    else if (count == 0) {
        balloonContainerTop = pumpTop - (pumpRect.height / 4 - pumpRect.height / 8);
        balloonContainerLeft = pumpLeft;
    }
    else if (count == 1) {
        balloonContainerTop = pumpTop - (pumpRect.height / 2 - pumpRect.height / 4);
        balloonContainerLeft = pumpLeft + pumpWidth / 8 - pumpWidth / 16;
    }

    return {
        top: balloonContainerTop,
        left: balloonContainerLeft
    };
}


let buildBalloon = () => {
    if (count == 0) {

        let c = "100";
        let d = "1000";
        let a = Math.floor((Math.random() * 26));
        // console.log("NUm",a);
        if (a == 0)
            a = 1;
        if (a < 10) {
            c += "0"
        }
        c += a.toString();
        let b = Math.floor((Math.random() * 10));
        // console.log("NUm",b);
        if (b == 0)
            b = 1;
        if (b < 10) {
            d += "0";
        }
        d += b.toString();

        let intersectingPoint = calculateBalloonContainerPosition(count);

        let div = document.createElement("div");
        div.className = "new-balloon";
        setTimeout(() => {
            div.classList.add("base-0");
        }, 10);
        div.innerHTML = `<div class="balloon-container" >
        <img  class="balloon-img-a"  src="./Graphics/alphabets/Symbol ${c}.png" alt="alphabet">
        <img class="balloon-img-b" src="./Graphics/ballons/Symbol ${d}.png" alt="balloon">
        </div>`;
        div.style.top = `${intersectingPoint.top}px`;
        div.style.left = `${intersectingPoint.left}px`;
        balloonContainer.append(div);
        count++;

    }
    else {
        let newBalloon = document.querySelector(".new-balloon");

        if (count == 1) {
            let intersectingPoint = calculateBalloonContainerPosition(count);
            newBalloon.style.top = `${intersectingPoint.top}px`;
            newBalloon.style.left = `${intersectingPoint.left}px`;
            newBalloon.classList.remove("base-0");
            newBalloon.classList.add("base-1");
            count++;
        }
        else {
            let intersectingPoint = calculateBalloonContainerPosition(count);
            newBalloon.style.top = `${intersectingPoint.top}px`;
            newBalloon.style.left = `${intersectingPoint.left}px`;
            newBalloon.classList.remove("base-1");
            newBalloon.classList.add("base-2");
            setTimeout(() => {
                newBalloon.classList.remove("base-2");
                newBalloon.classList.remove("new-balloon");
                newBalloon.classList.add("old-balloon");
                // newBalloon.classList.add("fly");
                newBalloon.innerHTML += `
                <img class="balloon-img-c" src="./Graphics/ballons/tail.png" alt="tail">`;
                newBalloon.addEventListener("click", (e) => {
                    // console.log(e.target);
                    let div = e.target.parentElement.parentElement;
                    if (div.classList.contains("old-balloon")) {
                        score.innerHTML = (parseInt(score.innerHTML) + 1).toString();
                        burstBalloon(div);
                    }
                })
                moveBalloon(newBalloon, 0);
            }, 1000);
            count = 0;

        }
    }
}


let pumpBalloon = () => {
    if (!isPumping) {
        isPumping = true;
        pumpHandle?.classList?.add("push");
        pumpBody?.classList?.add("squish");
        pumpTail?.classList?.add("taileffect");
        if (flag === 1) {
            flag++;
            Score();
        }
        buildBalloon();
        setTimeout(() => {
            pumpHandle?.classList?.remove("push");
            pumpBody?.classList?.remove("squish");
            pumpTail?.classList?.remove("taileffect");
            isPumping = false;
        }, 1000);
    }
}


pumpHandle.addEventListener('click', () => pumpBalloon());



// balloon logic
let moveBalloon = (balloon, currentPositionIndex) => {
    if (currentPositionIndex >= positions.length) {
        burstBalloon(balloon);
        return;
    }

    let currentPosition = positions[currentPositionIndex];
    balloon.style.transition = "top 2.5s linear, left 2.5s ease-out";
    balloon.style.top = currentPosition.top + "%";
    balloon.style.left = currentPosition.left + "%";
    currentPositionIndex++;

    setTimeout(() => moveBalloon(balloon, currentPositionIndex), 3000);
}

function burstBalloon(balloon) {
    // console.log("burst it");
    balloon.classList.add("burst");
    balloon.addEventListener("animationend", () => removeBalloon(balloon));
}

function removeBalloon(balloon) {
    balloon.remove();
}

