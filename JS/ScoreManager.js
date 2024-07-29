import {ScoreToken} from "./ScoreToken.js";
import {Effect} from "./Effect.js";
import {random} from "./Main.js";

export class ScoreManager {
    #currentToken1;
    #currentToken2;
    #player;
    #playerManager;
    #size;
    #map;
    #minX;
    #maxX;
    #minY;
    #maxY;

    // value to which the lifetime of a token will be reset to in seconds
    fixTokenLifetime = 10;
    #lifeTime;

    constructor(player, playerManager, size, minX, maxX, minY, maxY) {
        this.#player = player;
        this.#playerManager = playerManager;
        this.#map = document.getElementById("mapContainer");

        this.#size = size;
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;

        this.#lifeTime = this.fixTokenLifetime;

        // try to spawn a token every 0.1 seconds
        setInterval(() => this.#spawnToken(), 100);
        setInterval(() => this.#reduceLifetimeToken(), 1000);
    }

    #spawnToken(){
        this.#handleSpawnToken(1);
        this.#handleSpawnToken(2);
    }

    #handleSpawnToken(tokenNumber){
        let coords = this.#generateRandomCoordinates();
        let spawnable = true;
        let token;

        // determine which token needs to be spawned
        if (tokenNumber === 1) {
            token = this.#currentToken1;
        } else {
            token = this.#currentToken2;
        }

        // check if token can be spawned
        if (token == null){
            // is allowed to spawn in head of player, it's part of the fun
            for (const ball of this.#player.curveBalls) {
                const dx = (coords[0] + this.#size / 2) - (ball.x + ball.size / 2);
                const dy = (coords[1] + this.#size / 2) - (ball.y + ball.size / 2);

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (this.#size + ball.size) / 2) {
                    spawnable = false;
                    this.#spawnToken();
                }
            }

            if (spawnable) {
                token = new ScoreToken(coords[0], coords[1], this.#size, new Effect(this.#player, this.#playerManager));
                if (tokenNumber === 1) {
                    this.#currentToken1 = token;
                } else {
                    this.#currentToken2 = token;
                }
            }
        }
    }

    #reduceLifetimeToken() {
        // both token have the same lifetime and if one of them is getting picked up, the other *dies* as well.
        if (this.#lifeTime === 0){
            const scoreTokens = document.querySelectorAll(".scoreToken");
            scoreTokens.forEach(token => token.remove());
            this.#lifeTime = this.fixTokenLifetime;
            this.#currentToken1 = undefined;
            this.#currentToken2 = undefined;
        } else {
            this.#lifeTime -= 1;
        }
    }

    #generateRandomCoordinates(){
        let x = random(this.#minX, this.#maxX);
        let y = random(this.#minY, this.#maxY);

        return [x, y];
    }

    detectCollision(){
        this.handleCollisionDetection(1);
        this.handleCollisionDetection(2);
    }

    handleCollisionDetection(tokenNumber){
        let token;
        if (tokenNumber === 1){
            token = this.#currentToken1;
        } else {
            token = this.#currentToken2;
        }

        if (token !== undefined) {
            const dx = (this.#player.x + this.#player.size / 2) - (token.x + token.size / 2);
            const dy = (this.#player.y + this.#player.size / 2) - (token.y + token.size / 2);

            const distance = Math.sqrt(dx * dx + dy * dy);

            // check if collision between player and scoreToken happend
            if (distance < (this.#player.size + token.size) / 2) {
                // execute effect and add score to score-display
                this.#setScore(token.effect.apply());

                const scoreTokens = document.querySelectorAll(".scoreToken");
                scoreTokens.forEach(token => token.remove());
                this.#lifeTime = this.fixTokenLifetime;
                this.#currentToken1 = undefined;
                this.#currentToken2 = undefined;
            }
        }
    }

    #setScore(score){
        const scoreBoard = document.getElementById("score");
        scoreBoard.innerText = parseInt(scoreBoard.innerText) + parseInt(score);
    }
}