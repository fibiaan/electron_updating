const { app, BrowserWindow, Menu, dialog, Tray, nativeImage, nativeTheme } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require("electron-is-dev");
const path = require("path");
let tray = null;
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')

    if(!isDev){
        console.log('not in dev')
        autoUpdater.checkForUpdates();
    }else{
        console.log('in dev')
    }
    
}
app.whenReady().then(async () => {
    try {
        createWindow()
        console.log(app.getAppPath())
        tray = new Tray(nativeImage.createFromPath(await validateThemeIcon()).resize({ width: 16 }));
        tray.setToolTip("Mocukp Baker App");
        tray.setContextMenu(Menu.buildFromTemplate(menuTrayTemplate));
    } catch (error) {
    }
})
const validateThemeIcon = async () => {
    if (nativeTheme.shouldUseDarkColors) {
      return path.join(__dirname, `assets/baker-tray-icon-light.png`);
    } else {
      return path.join(__dirname, `assets/baker-tray-icon.png`);
    }
}
let menuTrayTemplate = [
    {
      label: "About Mockup Baker..",
      icon: nativeImage
        .createFromPath(__dirname + "/assets/baker-tray-icon.png")
        .resize({ width: 16 }),
      click: function () {},
    },
    {
        label: "Probe update..",
        icon: nativeImage
          .createFromPath(__dirname + "/assets/baker-tray-icon.png")
          .resize({ width: 16 }),
        click: function () {},
      },
    {
      type: "separator",
    },
    {
      label: "Install Plugin",
      id: "plugin",
      click: function () {
        if (status.plugin == "toInstall") {
          installPlugin();
        } else {
          uninstallPlugin();
        }
      },
    },
    {
      label: "Start Server",
      id: "server",
      click: async function () {
        changeServer(!status.server);
      },
    },
    {
      type: "separator",
    },
    {
      label: "Help",
      id: "help",
      click: function () {
        shell.openExternal("https://originalmockups.com");
      },
    },
    {
      label: "Preferences",
      id: "preferences",
      accelerator: process.platform == "darwin" ? "Command+," : "Ctrl+Q",
      click: function () {},
    },
    {
      label: "Quit",
      accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
      click: function () {
        app.quit();
      },
    },
  ];

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

autoUpdater.on('error', (message) => {
    const dialogOpts = {
        type: "info",
        buttons: [':('],
        title: "Error",
        message: "Error",
        detail: message.message
    }
    
    dialog.showMessageBox(dialogOpts).then((returnValue) => {});
})