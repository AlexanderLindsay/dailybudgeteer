namespace FileHandling {
    "use strict";

    let remote: Electron.Remote = require("remote");
    let dialog: Electron.Dialog = remote.require("dialog");
    let fs = require("fs");

    export class FileDialog {
        public save = (data: string) => {

            let dialogSettings: Electron.Dialog.SaveDialogOptions = {
                filters: [
                    { name: "json", extensions: ["json"] }
                ]
            };

            dialog.showSaveDialog(null, dialogSettings, this.onSave.bind(this, data));
        };

        private onSave = (data: string, fileName: string) => {
            if (fileName === undefined) {
                return;
            }
            fs.writeFile(fileName, data, function(err) {
                dialog.showMessageBox(null, { title: "File Saved", message: `File ${fileName} was saved successfully.`, buttons: ["Ok"] });
            });
        };
    }
}