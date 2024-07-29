let hsList;

// always executed when script is loaded
function init() {
    if (localStorage.getItem("hsList") == null) {
        hsList = [
            ["Michel", "550"],
            ["Alex", "450"],
            ["Mitchel", "360"],
            ["xelA", "280"],
            ["Michael", "210"],
            ["Alexander", "150"],
            ["Mikael", "100"],
            ["A_L_E_X", "60"],
            ["Michelle", "30"],
            ["xXAlexXx", "10"]
        ];
        localStorage.setItem("hsList", JSON.stringify(hsList));
    };
}

function fillDom() {
    //put user-agent text in upper right corner
    const useragentTxt = document.getElementById("userAgent");
    useragentTxt.innerText = window.navigator.userAgent;
//get items from hsList
    hsList = JSON.parse(localStorage.getItem("hsList"));
    const highscoreList = document.getElementById("highscoreList");
//create the display of the list as first element : second column element
    hsList.forEach((elem) => {
        let listElement = document.createElement("li");
        listElement.innerText = elem[0] + " : " + elem[1];
        highscoreList.appendChild(listElement);
    })
}

// add new score into the hsList array
export function addScore(arr) {
    hsList = JSON.parse(localStorage.getItem("hsList"));
    for (let i = 0; i < hsList.length; i++) {
        if (parseInt(hsList[i][1]) < parseInt(arr[1])) {
            hsList.splice(i, 0, arr);
            break;
        }
    }
    // pop eleventh element
    hsList.pop();

    //update item in storage
    localStorage.setItem("hsList", JSON.stringify(hsList));
}

// execute init
init();

// check if script is being loaded in ScorePage.html
if (window.location["pathname"].includes("ScorePage.html")) {
    fillDom(hsList);
}
