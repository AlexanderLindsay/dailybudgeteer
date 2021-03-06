/// <reference path="../../typings/main.d.ts" />

let remote: Electron.Remote = require("electron").remote;
let dialog: Electron.Dialog = remote.dialog;
let fs = require("fs");

export default class FileDialog {

    public save = (data: string, fileName: string, result: (fileName: string) => void, openDialog: boolean = false) => {
        let dialogSettings: Electron.Dialog.SaveDialogOptions = {
            filters: [
                { name: "json", extensions: ["json"] }
            ]
        };

        if (fileName === undefined || fileName === null || fileName.length <= 0 || openDialog) {
            dialog.showSaveDialog(null, dialogSettings, this.onSaveDialogClose.bind(this, data, result));
        } else {
            this.onSaveDialogClose(data, result, fileName);
        }
    };

    private onSaveDialogClose = (data: string, result: (fileName: string) => void, fileName: string) => {
        if (fileName === undefined || fileName === null || fileName.length <= 0) {
            return;
        }

        result(fileName);

        fs.writeFile(fileName, data, function (err: any) {
            dialog.showMessageBox(null, {
                title: "File Saved",
                message: `File ${fileName} was saved successfully.`,
                buttons: ["Ok"]
            });
        });
    };

    public open = (onOpen: (data: string, fileName: string) => void) => {
        let dialogSettings: Electron.Dialog.OpenDialogOptions = {
            filters: [
                { name: "json", extensions: ["json"] }
            ]
        };

        dialog.showOpenDialog(null, dialogSettings, this.onOpenDialogClose.bind(this, onOpen));
    };

    private onOpenDialogClose = (onOpen: (data: string, fileName: string) => void, fileNames: string[]) => {
        if (fileNames === undefined) {
            return;
        }
        if (fileNames.length > 0) {
            let fileName = fileNames[0];
            fs.readFile(fileName, "utf-8", (err: any, data: any) => {
                onOpen(data, fileName);
                dialog.showMessageBox(null, {
                    title: "File Opened",
                    message: `File ${fileName} was opened successfully.`,
                    buttons: ["Ok"]
                });
            });
        }
    };
}
