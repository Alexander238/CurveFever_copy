const volumeSlider = document.getElementById("volume");


volumeSlider.addEventListener("input", setVolume);
function setVolume() {
    sessionStorage.setItem("volume", JSON.stringify(volumeSlider.value / 100));
}


// check if volume has been set already. If not, set it so 75%.
if (sessionStorage.getItem("volume") == null) {
    volumeSlider.value = 75;
    sessionStorage.setItem("volume", JSON.stringify(0.75));
} else {
    volumeSlider.value = JSON.parse(sessionStorage.getItem("volume") * 100);
}