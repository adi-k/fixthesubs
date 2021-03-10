const electron = require('electron');
const url = require('url');
const path = require('path');
var fs = require('fs');
var JSZip = require("jszip");
var FileSaver = require('file-saver');



const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let mainWindow;
let addWindow;


//when ready go

app.on('ready', function() {

    //new window
    mainWindow = new BrowserWindow({
        width: 500, height: 300, frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    //loading our html file

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //quit when closed
    mainWindow.on('closed', function() {

        app.quit();
    })

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert
    Menu.setApplicationMenu(null);
    //Menu.setApplicationMenu(mainMenu);


})


// adding menu options

const mainMenuTemplate = [{
        label: 'File',
        submenu: [{
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }

];

//close app on exit click
ipcMain.on('close-me', (evt, arg) => {
  app.quit()
})


//if not in prod add devtools
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [{

                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click() {
                    app.quit();
                },
                click(item, focusedWindow) {

                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]


    })
}