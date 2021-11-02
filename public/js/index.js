const ipc = require("electron").ipcRenderer;
require("electron").webFrame.setZoomLevel(1)
const textArea = document.querySelector("textarea");

function setTitle(title) {
    document.title = title;
}

let path;
ipc.on("fileData", (event, data) => {
    textArea.value = data.text;
    path = data.path;
    fileData = data.text;
    setTitle(`notepad-darky - ${path}`);
});

ipc.on("save-file", (e) => {
    let newText = textArea.value;
    fileData = newText;
    ipc.send("save-file-main", { path, text: newText });
});

ipc.on("save-as-file", (e, path) => {
    let newText = textArea.value;
    fileData = newText;
    ipc.send("save-file-main", { path, text: newText });
    setTitle(`notepad-darky - ${path}`);
});

ipc.on("change-font", (e, fonts) => {
    console.log(fonts)
    textArea.style.fontFamily = fonts[0];
    textArea.style.fontSize = fonts[1];
})