const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require("fs");
const MenuFunctions = require("./utils/menuFunctions");

let win;
let menuFunctions;
function createWindow() {
    win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, "public", "favicon.ico"),
        title: "notepad-darky"
    })

    win.loadFile(path.join(__dirname, "public", "index.html"));
    menuFunctions = new MenuFunctions(win);
}

app.whenReady().then(() => {
    createWindow()

    win.on("ready-to-show", () => win.show());

    // Application Menu
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "Open",
                    accelerator: "Ctrl+O",
                    click: () => menuFunctions.handleOpen()
                },
                { type: "separator" },
                {
                    label: "Save",
                    accelerator: "Ctrl+S",
                    click: () => menuFunctions.handleSave()
                },
                {
                    label: "Save As",
                    accelerator: "Ctrl+Shift+S",
                    click: () => menuFunctions.handleSaveAs()
                },
                { type: "separator" },
                {
                    accelerator: "Ctrl+Q",
                    role: "quit"
                },
            ]
        },
        {
            label: "Edit",
            submenu: [
                { role: "selectAll" },
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
            ]
        },
        {
            label: "Format",
            submenu: [
                {
                    label: "fonts",
                    accelerator: "Ctrl+F",
                    click: () => require("./fontWindow")(win)
                },
            ]
        },
        {
            label: "View",
            submenu: [
                {
                    role: "zoomin",
                    accelerator: "CmdOrCtrl+Shift+Z",
                },
                {
                    role: "zoomout",
                    accelerator: "CmdOrCtrl+Shift+X",
                },
            ]
        },
        {
            label: "About",
            submenu: [
                {
                    label: "Author",
                    click: () => menuFunctions.handleAuthor()
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // IpcMain functions
    ipcMain.on("save-file-main", (e, data) => {
        if (data.path) {
            fs.writeFile(data.path, data.text, (err) => {
                if (err) {
                    dialog.showErrorBox("Error", err.message);
                    return;
                }
            })
            return;
        }
        menuFunctions.handleSaveAs()
    })

    ipcMain.on("close-modal", (e, data) => {
        if (data.message === "cancel") {
            BrowserWindow.getFocusedWindow().close();
            return;
        }

        if (data.message === "apply") {
            win.webContents.send("change-font", data.fonts);
            BrowserWindow.getFocusedWindow().close();
        }
    })


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
