/// <reference path="../data/context.ts" />
/// <reference path="../filehandling/dialog.ts" />

namespace Components {
    "use strict";

    class PageController implements _mithril.MithrilController {
        constructor(private context: Data.Context, private fileDialog: FileHandling.FileDialog) { }

        saveFile = () => {
            this.fileDialog.save(this.context.writeData());
        };

        openFile = () => {
            this.fileDialog.open(this.context.loadData);
        };
    }

    export class Page implements _mithril.MithrilComponent<PageController> {
        public controller: () => PageController;
        public view: _mithril.MithrilView<PageController>;

        constructor(context: Data.Context, fileDialog: FileHandling.FileDialog, body: _mithril.MithrilComponent<{}>) {
            this.controller = () => { return new PageController(context, fileDialog); };
            this.view = (ctrl) => {
                return m("div", [
                    m.component(body),
                    m("button", { onclick: ctrl.openFile }, "Open"),
                    m("button", { onclick: ctrl.saveFile }, "Save")
                ]);
            };
        }
    }
}