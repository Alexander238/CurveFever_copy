import {CurveBall} from "./CurveBall.js";

class Player {
    head;
    x;
    y;
    color;
    //contains curveBall elements of the player curve
    curveBalls = [];
    #name;
    size;

    constructor(x, y, name, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.#name = name;
        this.size = size;

        this.#spawnHead();
    }

    #spawnHead(){
        this.head = new CurveBall(this.x, this.y, this.color, this.size);
    }

    addCurveBall(ball){
        this.curveBalls.push(ball);
        // activate hitbox after 0.6 seconds
        setTimeout(() => {
            ball.hasHitbox = true;
          }, 600);
    }
}

export {Player};