/// <reference path="typings/main.d.ts"/>

module Budget {
    "use strict";
    
    const electron = require('electron');
    const app: Electron.App = electron.app;
    
    class Main {
        
        private mainWindow: Electron.BrowserWindow;
        
        constructor(private width: number, private height: number) {
            app.on("window-all-closed", () => {
               if(process.platform != 'darwin'){
                   app.quit();
               } 
            });
            
            app.on('ready', () => {
               
               this.mainWindow = new electron.BrowserWindow({
                   width: this.width, 
                   height:this.height });
                
                this.mainWindow.loadURL("file://" + __dirname + "/index.html");
                
                this.mainWindow.on('closed', () => {
                    this.mainWindow = null;
                });                   
            });
        }
    }
    
    var main: Main = new Main(800, 600);
}