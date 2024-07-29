import {CurveBall} from "./CurveBall.js";

class PlayerManager {
    player;
    manager;

    //movement
    left = "a";
    right = "d";
    turnSpeed = 3.5;
    speed = 3;
    angle;
    pressedKey = "";
    deltaX;
    deltaY;

    //debuffBools
    invertedControl = false;
    curveRadiusIncreased = false;
    speedIncreased = false;
    invisible = false;

    //skipping
    isSkipping = false;
    canSkip = true;
    cooldown = 5;
    skipSymbol;

    //collisioon
    maxX;
    maxY;

    //intervals
    drawInterval;
    drawIntervalTime = 90;

    constructor(player, gameManager, startAngle, maxX, maxY) {
        this.player = player;
        this.manager = gameManager;
        this.angle = startAngle;
        this.#addEventListeners();

        this.maxX = maxX;
        this.maxY = maxY;

        setInterval(() => this.controlLoop(), 16.67);
        this.drawInterval = setInterval(() => this.drawLoop(), this.drawIntervalTime);
        this.skipSymbol = document.getElementById("abilitySkipSymbol");
    }

    restartDrawInterval(){
        clearInterval(this.drawInterval);
        this.drawInterval = setInterval(() => this.drawLoop(), this.drawIntervalTime);
    }

    #addEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.key.toLowerCase() === this.left) {
                this.pressedKey = event.key.toLowerCase();
            } else if (event.key.toLowerCase() === this.right) {
                this.pressedKey = event.key.toLowerCase();
            }

        });
        document.addEventListener("keyup", (event) => {
            /* must be like this! Example: If player pressed a and then d but only let's go of a after d is pressed,
             pressedKey would have been overwritten with "" and thus the player would not move right immediately
             after pressing d, but only after a couple of ms.
             */
            if (event.key.toLowerCase() === this.left && this.pressedKey === this.left) {
                this.pressedKey = "";
            } else if (event.key.toLowerCase() === this.right && this.pressedKey === this.right) {
                this.pressedKey = "";
            }
        });

        // handle skip
        document.addEventListener("keydown", (event) => {
            if (event.key.toLowerCase() === " ") {
                if (this.canSkip) {
                    this.#skip();
                    this.canSkip = false;
                    this.skipSymbol.style.backgroundColor = "gray";
                    this.skipSymbol.style.boxShadow = "0 0 0 0 black";
                    setTimeout(() => {
                        this.canSkip = true;
                        this.skipSymbol.style.backgroundColor = "yellow";
                        this.skipSymbol.style.boxShadow = "0 0 5px 3px gold,\n 0 0 10px 2px grey";
                    }, this.cooldown * 1000);
                }
            }
        });
    }

    /**
     * Adjust angle of player
     */
    controlLoop() {
        switch (this.pressedKey) {
            case this.left:
                // Pi / 180 is conversion from degree to radians (circle units)
                this.angle -= this.turnSpeed * Math.PI / 180;
                break;
            case this.right:
                this.angle += this.turnSpeed * Math.PI / 180;
                break;
            default:
                break;
        }
    }

    move() {
        // small step in x direction multiplied by speed
        this.deltaX = Math.cos(this.angle) * this.speed;
        // small step in y direction multiplied by speed
        this.deltaY = Math.sin(this.angle) * this.speed;

        this.player.x = parseFloat(this.player.head.htmlElement.style.left);
        this.player.y = parseFloat(this.player.head.htmlElement.style.top);

        this.player.head.htmlElement.style.left = `${this.player.x + this.deltaX}px`;
        this.player.head.htmlElement.style.top = `${this.player.y + this.deltaY}px`;
    }

    drawLoop() {
        if (this.manager.gameRunning && !this.isSkipping) {
            const ball = new CurveBall(this.player.x, this.player.y, this.player.color, this.player.size);
            this.player.addCurveBall(ball);
        }
    }

    detectCollision() {
        // borders
        if ((this.player.x < 0 || this.player.x > this.maxX) || (this.player.y < 0 || this.player.y > this.maxY)) {
            this.manager.stopGame();
        }

        for (const ball of this.player.curveBalls) {
            if (ball.hasHitbox) {
                const dx = (this.player.x + this.player.size / 2) - (ball.x + ball.size / 2);
                const dy = (this.player.y + this.player.size / 2) - (ball.y + ball.size / 2);

                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < (this.player.size + ball.size) / 2) {
                    this.manager.stopGame();
                }
            }
        }
    }

    // used in drawLoop and key-event of space
    #skip() {
        this.isSkipping = true;
        setTimeout(() => {
            this.isSkipping = false;
        }, 350);
    }
}

export {PlayerManager};