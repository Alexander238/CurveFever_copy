export class ScoreToken {
    x;
    y;
    size;
    effect;
    #color;

    constructor(x, y, radius, effect) {
        this.x = x;
        this.y = y
        this.size = radius
        this.effect = effect;
        this.#color = effect.color;

        this.#spawnToken();
    }

    #spawnToken(){
        this.htmlElement = document.createElement("div");
        this.htmlElement.classList.add("scoreToken");
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.backgroundColor = this.#color;
        this.htmlElement.style.width = this.size + "px";
        this.htmlElement.style.height = this.size + "px";

        const map = document.getElementById("mapContainer");
        map.insertAdjacentElement("beforeend", this.htmlElement);
    }
}