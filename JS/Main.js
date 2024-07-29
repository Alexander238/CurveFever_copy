import {Player} from "./Player.js";
import {PlayerManager} from "./PlayerManager.js";
import {GameManager} from "./GameManager.js"
import {ScoreManager} from "./ScoreManager.js";
import {CurveBall} from "./CurveBall.js";

export function random(min, max) {
    const res = Math.random() * (max - min) + min;
    return parseFloat(res);
}

/**
 * Calculate direction in which the player has to look when he spawns so he doesn't start facing a wall!
 */
function decideDirection(pX, pY, minX, maxX, minY, maxY) {
    let dir;
    // decrease spread of facing direction
    const narrower = 0.05 * Math.PI;

    const upRight = random(1.5 * Math.PI + narrower, 2 * Math.PI - narrower);
    const upLeft = random(Math.PI + narrower, 1.5 * Math.PI - narrower);
    const downRight = random(narrower, 0.5 * Math.PI - narrower);
    const downLeft = random(0.5 * Math.PI + narrower, Math.PI - narrower);

    if (isCloserToFirst(pX, minX, maxX)) {
        if (isCloserToFirst(pY, minY, maxY)) {
            dir = downRight;
        } else {
            dir = upRight;
        }
    } else {
        if (isCloserToFirst(pY, minY, maxY)) {
            dir = downLeft;
        } else {
            dir = upLeft;
        }
    }
    return dir;
}

/**
 * Check if number is closer to first than to second. Return true if it is, else false.
 */
function isCloserToFirst(number, first, second) {
    // use absolute value for comparision
    const diff1 = Math.abs(number - first);
    const diff2 = Math.abs(number - second);

    return diff1 < diff2;
}


const mapContainer = document.getElementById("mapContainer");
const manager = new GameManager();

const width = mapContainer.clientWidth;
const height = mapContainer.clientHeight;
// ballSize for all balls in the screen
const ballSize = 20;

// min & max starting/spawn positions of player
const minStartX = width * 0.1;
const maxStartX = width - (width * 0.1 + (ballSize));
const minStartY = height * 0.1;
const maxStartY = height - (height * 0.1 + ballSize);

// generate random x and y coordinate for player position
let playerX = random(minStartX, maxStartX);
let playerY = random(minStartY, maxStartY);

// ensure that player can't spawn out of border (Should only happen if the screen is really small)
if (playerY < minStartY || playerY > maxStartY) {
    playerY = height / 2;
} else if (playerX < minStartX || playerX > maxStartX) {
    playerX = width / 2;
}

/*
// Border visualisation
const tl = new CurveBall(minStartX, minStartY, "1", "blue", 20);
const tr = new CurveBall(maxStartX, minStartY, "1", "blue", 20);
const bl = new CurveBall(minStartX, maxStartY, "1", "blue", 20);
const br = new CurveBall(maxStartX, maxStartY, "1", "blue", 20);
*/

const player = new Player(playerX, playerY, "Max", "#FF0000FF", ballSize);

const maxAllowedX = mapContainer.clientWidth - ballSize;
const maxAllowedY = mapContainer.clientHeight - ballSize;
const playerFacingDirection = decideDirection(playerX, playerY, minStartX, maxStartX, minStartY, maxStartY);
const playerManager = new PlayerManager(player, manager, playerFacingDirection, maxAllowedX, maxAllowedY);
const scoreManager = new ScoreManager(player, playerManager, ballSize, minStartX, maxStartX, minStartY, maxStartY);


const loopInterval = 16 // 60 fps
setTimeout(loop, loopInterval);

function loop() {
    if (manager.gameRunning) {
        playerManager.move();
        playerManager.detectCollision();
        scoreManager.detectCollision();
    }
    setTimeout(loop, loopInterval);
}