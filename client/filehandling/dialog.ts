/// <reference path="../../typings/main.d.ts" />

let remote: Electron.Remote = require("remote");
let dialog: Electron.Dialog = remote.require("dialog");
let fs = require("fs");

export default class FileDialog {

    public save = (data: string) => {
        let dialogSettings: Electron.Dialog.SaveDialogOptions = {
            filters: [
                { name: "json", extensions: ["json"] }
            ]
        };

        dialog.showSaveDialog(null, dialogSettings, this.onSaveDialogClose.bind(this, data));
    };

    private onSaveDialogClose = (data: string, fileName: string) => {
        if (fileName === undefined) {
            return;
        }
        fs.writeFile(fileName, data, function(err: any) {
            dialog.showMessageBox(null, { title: "File Saved", message: `File ${fileName} was saved successfully.`, buttons: ["Ok"] });
        });
    };

    public open = (onOpen: (data: string) => void) => {
        let dialogSettings: Electron.Dialog.OpenDialogOptions = {
            filters: [
                { name: "json", extensions: ["json"] }
            ]
        };

        dialog.showOpenDialog(null, dialogSettings, this.onOpenDialogClose.bind(this, onOpen));
    };

    private onOpenDialogClose = (onOpen: (data: string) => void, fileNames: string[]) => {
        if (fileNames === undefined) {
            return;
        }
        if (fileNames.length > 0) {
            let fileName = fileNames[0];
            fs.readFile(fileName, "utf-8", (err: any, data: any) => {
                onOpen(data);
                dialog.showMessageBox(null, { title: "File Opened", message: `File ${fileName} was opened successfully.`, buttons: ["Ok"] });
            });
        }
    };
}
