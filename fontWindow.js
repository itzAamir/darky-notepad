const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let fontWindow;

module.exports = (win) => {
    fontWindow = new BrowserWindow({
        parent: win,
        modal: true,
        show: false,
        height: 500,
        width: 400,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    fontWindow.loadFile(path.join(__dirname, "public", "format.html"));
    fontWindow.setMenuBarVisibility(false);

    fontWindow.once("ready-to-show", () => {
        fontWindow.show();
    })
}
