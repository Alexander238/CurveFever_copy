import {random} from "./Main.js";

export class Effect {
    // list of methods which affect the player
    #effects = [];
    #player;
    #playerManager;
    #shortenPercentage = 0.2;
    #time;
    color;
    #randEffect;

    constructor(player, playerManager) {
        this.#effects.push(() => this.invertControl());
        this.#effects.push(() => this.increaseCurveRadius());
        this.#effects.push(() => this.increaseSpeed());
        this.#effects.push(() => this.invisiblePlayer());

        this.generateRandEffect();
        this.#player = player;
        this.#playerManager = playerManager;
    }

    /**
     *  generate random effect for an instance of this class
     */
    generateRandEffect(){
        let randomIndex = Math.round(random(-0.49, this.#effects.length - 1 + 0.49));

        switch (randomIndex) {
            case 0:
                this.color = "yellow";
                break;
            case 1:
                this.color = "deeppink";
                break;
            case 2:
                this.color = "darkorange"
                break;
            case 3:
                this.color = "white"
                break;
        }

        this.#randEffect = this.#effects[randomIndex];
    }

    apply() {
        return this.#randEffect();
    }

    invisiblePlayer(){
        let score = 0;

        if (!this.#playerManager.invisible) {
            this.#playerManager.invisible = true;

            this.#time = 1;
            // calculate the score which the player will recieve by getting affected by this effect.
            this.countdown("invisiblePlayer");
            score = this.shortenCurve();

            let styleSheet = document.styleSheets[0];

            const rules = styleSheet.cssRules || styleSheet.rules;
            let curveBallRuleIndex = -1;
            // iterate through all rules until finding a rule with the selectorText .curveBall
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];
                if (rule instanceof CSSStyleRule && rule.selectorText === ".curveBall") {
                    curveBallRuleIndex = i;
                    break;
                }
            }
            // .curveBall rule.
            let curveBallRule = rules[curveBallRuleIndex];
            // adjust rule of .curveBall class: change opacity to 0.
            curveBallRule.style.opacity = "0";

            // deactivate debuff after this.#time seconds
            setTimeout(() => {
                curveBallRule.style.opacity = "1";
                this.#playerManager.invisible = false;
            }, this.#time * 1000);
        }

        return score;
    }

    increaseSpeed(){
        let score = 0;

        if (!this.#playerManager.speedIncreased){
            this.#playerManager.speedIncreased = true;

            this.#time = 2;
            this.countdown("increaseSpeed");
            score = this.shortenCurve();


            let playerSpeed = this.#playerManager.speed;
            let drawTime = this.#playerManager.drawIntervalTime;

            this.#playerManager.speed = playerSpeed * 2;
            this.#playerManager.drawIntervalTime = drawTime * 0.5;
            // restart since drawIntervalTime has been changed
            this.#playerManager.restartDrawInterval();

            setTimeout(() => {
                this.#playerManager.speed = playerSpeed;
                this.#playerManager.drawIntervalTime = drawTime;

                this.#playerManager.restartDrawInterval();
                this.#playerManager.speedIncreased = false;
            }, this.#time * 1000);
        }

        return score;
    }

    increaseCurveRadius(){
        let score = 0;

        if (!this.#playerManager.curveRadiusIncreased) {
            this.#playerManager.curveRadiusIncreased = true;

            this.#time = 5;
            this.countdown("increaseCurveRadius");
            score = this.shortenCurve();

            let ts = this.#playerManager.turnSpeed;
            this.#playerManager.turnSpeed = ts * 0.6;

            setTimeout(() => {
                this.#playerManager.turnSpeed = ts;
                this.#playerManager.curveRadiusIncreased = false;
            }, this.#time * 1000);
        }

        return score;
    }

    invertControl() {
        // adjust shortenPercentage since this debuff is harder than the others
        this.#shortenPercentage = 0.3
        let score = 0;
        if (!this.#playerManager.invertedControl){
            this.#playerManager.invertedControl = true;

            this.#time = 3;
            this.countdown("invertDebuff");
            score = this.shortenCurve();

            let store = this.#playerManager.left;
            this.#playerManager.left = this.#playerManager.right
            this.#playerManager.right = store;

            setTimeout(() => {
                let store = this.#playerManager.left;
                this.#playerManager.left = this.#playerManager.right
                this.#playerManager.right = store;
                this.#playerManager.invertedControl = false;
            }, this.#time * 1000)
        }

        return score;
    }

    shortenCurve() {
        const length = this.#player.curveBalls.length;
        const deletedAmount = this.#player.curveBalls.slice(Math.floor(length * (1 - this.#shortenPercentage))).length;

        // remove html elements of to-be-deleted balls from DOM
        for (let i = 0; i < deletedAmount && i < length; i++) {
            this.#player.curveBalls[i].htmlElement.remove();
        }
        // remove from the array
        this.#player.curveBalls = this.#player.curveBalls.slice(deletedAmount);

        return deletedAmount;
    }

    // display of debuff-length in the DOM
    countdown(debuffID) {
        let element = document.getElementById(debuffID);
        let timer = this.#time;
        element.innerText = timer.toString();
        // setInterval begins after 1 second, so we have to decrease timer by 1 if we want it to work.
        timer--;

        let countdownInterval = setInterval(function () {
            element.innerText = timer.toString();
            timer--;

            if (timer < 0) {
                clearInterval(countdownInterval);
                element.innerText = "_";
            }
        }, 1000);
    }
}

