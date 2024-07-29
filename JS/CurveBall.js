/**
 * Body-Element of the Player-Curve
 */
export class CurveBall {
    x;
    y;
    #color;
    size;
    // after 0.6 seconds, hitbox will activate (Player.js)
    hasHitbox = false;

    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.#color = color;
        this.size = size

        this.#spawnBall();
    }

    #spawnBall(){
        this.htmlElement = document.createElement("div");
        this.htmlElement.classList.add("curveBall");
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.backgroundColor = this.#color;
        this.htmlElement.style.width = this.size + "px";
        this.htmlElement.style.height = this.size + "px";

        const map = document.getElementById("mapContainer");
        map.insertAdjacentElement("beforeend", this.htmlElement);
    }
}