/// <reference path="../data/budgetcontext.ts" />
/// <reference path="../filehandling/dialog.ts" />

namespace Components {
    "use strict";

    class PageController implements _mithril.MithrilController {
        constructor(private context: Data.BudgetContext, private fileDialog: FileHandling.FileDialog) { }

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

        constructor(context: Data.BudgetContext, fileDialog: FileHandling.FileDialog, menu: _mithril.MithrilComponent<{}>, body: _mithril.MithrilComponent<{}>) {
            this.controller = () => { return new PageController(context, fileDialog); };
            this.view = (ctrl) => {
                return m("div", [
                    m("div.ui.top.attached.menu", [
                        m("div.ui.simple.dropdown.item", [
                            "File",
                            m("i.dropdown.icon"),
                            m("div.menu", [
                                m("div.item", { onclick: ctrl.openFile }, "Open"),
                                m("div.item", { onclick: ctrl.saveFile }, "Save")
                            ])
                        ])
                    ]),
                    m.component(menu),
                    m("div.ui.grid.container", m.component(body))
                ]);
            };
        }
    }
}