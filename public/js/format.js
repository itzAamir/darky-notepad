const ipcRenderer = require("electron").ipcRenderer;

const testingText = document.getElementById("testing");
const select = document.getElementById("font-selector");
const fontSize = document.getElementById("font-size");

let localFontFamily = "Arial";
let localFontSize = "16px";

select.addEventListener("change", () => {
    testingText.style.fontFamily = select.value;
    localFontFamily = select.value;
})


// setting font-size dropdown
for (let i = 8; i <= 72; i++) {
    if (i % 2 === 0) {
        fontSize.innerHTML += `<option value=${i}>${i}</option>`
    }
}

fontSize.addEventListener("change", () => {
    testingText.style.fontSize = fontSize.value + "px";
    localFontSize = fontSize.value + "px";

});

document.querySelector(".applyBtn").addEventListener("click", () => {
    ipcRenderer.send("close-modal", { message: "apply", fonts: [localFontFamily, localFontSize] });
});

document.querySelector(".cancelBtn").addEventListener("click", () => {
    ipcRenderer.send("close-modal", { message: "cancel" });
});