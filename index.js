const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require("electron-is-dev");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')

    if(!isDev){
        autoUpdater.checkForUpdates();
    }
    
}
app.whenReady().then(() => {
    createWindow()
})

autoUpdater.on("update-available", (_event, releasesNotes, releaseName) =>{
    const dialogOpts = {
        type: "info",
        buttons: ['Ok'],
        title: "Application Update",
        message: "Notas de versión",
        detail: "A new version is being downloaded."
    }

    dialog.showMessageBox(dialogOpts, (response) => {});
})

autoUpdater.on("update-downloaded", (_event, releasesNotes, releaseName) => {
    const dialogOpts = {
        type: "info",
        buttons: ['Restart', 'Later'],
        title: "Application Update",
        message: "Notas de versión",
        detail: "Restart the application."
    }
    
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if(returnValue.response === 0) autoUpdater.quitAndInstall();
    });

})
