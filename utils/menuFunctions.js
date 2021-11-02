const { dialog } = require("electron");
const fs = require("fs");

class FileManager {
    constructor(win) {
        this.win = win;
    }

    handleOpen() {
        dialog.showOpenDialog(this.win, {
            filters:
                [
                    { name: "Text Documents", extensions: ["txt"] },
                    { name: "All Files", extensions: ["*"] },
                ]
        }).then(res => {
            if (!res.canceled) {
                fs.readFile(res.filePaths[0], "utf-8", (err, data) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    let filePath = res.filePaths[0];
                    this.win.webContents.send("fileData", { text: data, path: filePath });
                })
            }
        })
    }

    handleSave() {
        this.win.webContents.send("save-file");
    }

    handleSaveAs() {
        dialog.showSaveDialog(this.win, {
            filters:
                [
                    { name: "Text Documents", extensions: ["txt"] },
                    { name: "All Files", extensions: ["*"] },
                ]
        })
            .then(res => {
                if (!res.canceled) {
                    this.win.webContents.send("save-as-file", res.filePath);
                }
            })
    }

    handleAuthor() {
        require("electron").shell.openExternal("https://www.itzAamir.in");
    }
}

module.exports = FileManager;
