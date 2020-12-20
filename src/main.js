'use strict'

const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const Store = require('./util/store');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;
let aboutWindow;
let settingsWindow;
// let editTechnicianWindow;
// let editOperatorWindow;

const store = new Store({
    configName: 'values-config',
    defaults: {
        operatorsList:  ['Operators list not loaded'],
        technicList: ['Technics list not loaded'],
        outSourceWorkers: ['Outsource workers list not loaded']
    }
});

function createMainWindow() {

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8',
            worldSafeExecuteJavaScript: true
        },
        // worldSafeExecuteJavaScript: true,
        icon: __dirname + 'assets/icons/repair-tool.ico'       
    });
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    mainWindow.maximize();    
    setWindowMinimumSize(mainWindow);    
    mainWindow.on('closed', () => app.quit());

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);
}

//Create add window
function createAddWindow() {

    // Create new window
    addWindow = new BrowserWindow({
        parent: mainWindow,      
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8',
            worldSafeExecuteJavaScript: true
        }        
    });
    
    addWindow.loadURL(url.format({

        pathname: path.join(__dirname, 'addWindow/addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //addWindow.removeMenu();
    addWindow.maximize();
    //addWindow.setAlwaysOnTop(true);    
    setWindowMinimumSize(addWindow);      
    addWindow.on('close', () => addWindow = null);
}

function createSettingsWindow() {

    settingsWindow = new BrowserWindow({
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8',
            worldSafeExecuteJavaScript: true
        }   
    });

    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'settingsWindow/settingsWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //settingsWindow.removeMenu();
    //settingsWindow.setAlwaysOnTop(true);
    settingsWindow.on('close', () => settingsWindow = null);

}

function createAboutWindow() {

    aboutWindow = new BrowserWindow({
        width: 600,
        height: 500,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8',
            worldSafeExecuteJavaScript: true
        }        
    });

    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'aboutWindow/aboutWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    aboutWindow.removeMenu();
    //aboutWindow.setAlwaysOnTop(true);
    aboutWindow.on('close', () => aboutWindow = null);
}

function editTechnician() {

    editTechnicianWindow = new BrowserWindow({
        width: 600,
        height: 500,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true
        }  
    });

    editTechnicianWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'aboutWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    editTechnicianWindow.removeMenu();
    //aboutWindow.setAlwaysOnTop(true);
    editTechnicianWindow.on('close', () => aboutWindow = null);
}

// Catch item:add
ipcMain.on('item:add', (e, item) => {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

ipcMain.on('item:reset', () => {
    addWindow.close();
});

// Catch open new work window
ipcMain.on('item:new-work', (e) => {
    createAddWindow();
});

// Catch printing all works
ipcMain.on('item:print-all-works', (e)=> {
    console.log('Printing all works');
});

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
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
    },
    {
        label: 'Settings',
        click() {
            createSettingsWindow();
        }
    },
    {
        label: 'About',
        click() {
            createAboutWindow();
        }
    }
];

// If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if (process.env.NODE_ENV != 'production') {

    mainMenuTemplate.push({

        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

// Set minimum size of the window
function setWindowMinimumSize(w) {
    
    let size = w.getSize();
    let width = size[0];
    let height = size[1];
    w.setMinimumSize(width / 2, height / 2);
}

// Listen for app to be ready
app.on('ready', () => createMainWindow());