'use strict';

const electron = require('electron')
// Module to control application life.
const app = electron.app

// Module to perform ipc communication
const ipcMain = electron.ipcMain

// Module to perform dialog integration
const dialog = electron.dialog

// Module to perform image manipulation
const nativeImage = electron.nativeImage

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')
const vindexer = require('./assets/video-indexer')
const fileURL = require('file-url')

const Vindexer = new vindexer('55fdf694c6844b27996f06384fa210b8');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 900, height: 700, autoHideMenuBar: true})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('select-file', (event, arg) => {
  
  var fileName = dialog.showOpenDialog({properties: ['openFile', 
  {
    filters: [
      {name: 'Videos', extensions: ['mp4']},
      {name: 'All Files', extensions: ['*']}
    ]
  }]});
  
  if (fileName != null) {
    event.returnValue = fileName;
  } else {
    event.returnValue = null
  }

});
  
ipcMain.on('upload-file', (event, arg) => { 

  console.log('upload-file: '+ arg[0]);

  Vindexer.uploadFile(arg[0], {
        // Optional 
        name: path.parse(arg[0]).name,
        privacy: 'Private', 
        language: 'English'
    })
     .then( function(result){ console.log (result.body) } );
    
    console.log('finished upload');

});

ipcMain.on('search-library', (event, arg) => { 
  
    console.log(arg);
  
    Vindexer.search({
          // Optional 
          privacy: 'Private',
          query: arg,
          pageSize: 10,
          searchInPublicAccount: false
       })
       .then( function(result){ console.log (result.body) } );
 
});
  
  
