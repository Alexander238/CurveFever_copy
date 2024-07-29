import {addScore} from "./Highscore.js";

class GameManager {
    gameRunning = false;
    #canPressEnter = true;
    #isPrepared = true;
    startSound = new Audio("../Audio/startSound.mp3");
    endSound = new Audio("../Audio/endSound.mp3");
    melody1 = new Audio("../Audio/melody1.mp3");
    playingMelody;

    // Handle Overlays
    #overlay;
    #popup;
    #readyOverlay;
    #posText;
    #confirmWrap;
    #position;
    #button;
    #nameInput;
    #playerScore;

    constructor() {
        if (sessionStorage.getItem("volume") == null) {
            sessionStorage.setItem("volume", JSON.stringify(0.75));
        }
        const volume = JSON.parse(sessionStorage.getItem("volume")) * 0.1;
        this.startSound.volume = volume;
        this.endSound.volume = volume;
        this.melody1.volume = volume;
        this.playingMelody = this.melody1;

        this.#overlay = document.getElementById("overlay");
        this.#popup = document.getElementById("popup");
        this.#posText = document.getElementById("posText");
        this.#confirmWrap = document.getElementById("confirmWrap");
        this.#position = document.getElementById("position");
        this.#button = document.getElementById("confirmButton");
        this.#nameInput = document.getElementById("playerName");
        this.#readyOverlay = document.getElementById("readyOverlay");
        this.#addEventListeners();
        this.#prepareGame();
    }

    #addEventListeners() {
        document.addEventListener("keypress", (event) => {
            if (event.key.toLowerCase() === "enter") {
                if (!this.gameRunning && this.#canPressEnter && this.#isPrepared) {
                    this.#startGame();

                    this.#canPressEnter = false;

                    setTimeout(() => {
                        this.#canPressEnter = true;
                    }, 2000);
                }
            }
        });

        this.startSound.addEventListener("ended", () => {
            // change gameRunning to true after the startSound has ended
            this.gameRunning = true;
            this.playingMelody.load();
            this.playingMelody.play();
        });

        // handle user pressing "confirm" after he scored a new highscore
        this.#button.addEventListener("click", () => {
            this.confirmPlace();
        })
    }

    #startGame() {
        console.log("START GAME");
        this.#isPrepared = false;

        this.#overlay.style.visibility = "hidden";
        this.#popup.style.visibility = "hidden";
        this.#readyOverlay.style.visibility = "hidden";

        //load ensures that audio will play from start
        this.startSound.load();
        this.startSound.play();
    }

    #prepareGame() {
        console.log("PREPARE GAME");
        this.#isPrepared = true;
        this.#overlay.style.visibility = "visible";
        this.#readyOverlay.style.visibility = "visible";
    }

    stopGame() {
        console.log("STOP GAME");
        this.#isPrepared = false;
        this.gameRunning = false;
        this.playingMelody.pause();
        this.endSound.load();
        this.endSound.play();

        this.displayScore();

        this.#overlay.style.visibility = "visible";
        this.#popup.style.visibility = "visible";
    }

    displayScore() {
        let playerScoreText = document.getElementById("playerScoreText");
        this.#playerScore = document.getElementById("score").innerText;


        // check if player scored a new highscore
        let hsArr = JSON.parse(localStorage.getItem("hsList"));
        let place = 11;
        for (let i = 0; i < hsArr.length; i++) {
            if (parseInt(hsArr[i][1]) < this.#playerScore) {
                place = i + 1;
                break;
            }
        }

        if (place <= 10) {
            playerScoreText.innerHTML = "<span>Score: " + this.#playerScore + "</span>\n" +
                "A New Highscore!";
            this.#posText.style.visibility = "visible";
            this.#confirmWrap.style.visibility = "visible";
            this.#position.innerText = place + "th";
        } else {
            playerScoreText.innerHTML = "<span>Score: " + this.#playerScore + "</span>\n" +
                "No New Highscore...";
            this.#posText.style.visibility = "hidden";
            this.#confirmWrap.style.visibility = "hidden";
        }
    }

    confirmPlace() {
        this.#posText.style.visibility = "hidden";
        this.#confirmWrap.style.visibility = "hidden";

        addScore([this.#nameInput.value, this.#playerScore]);
    }
}

export {GameManager};