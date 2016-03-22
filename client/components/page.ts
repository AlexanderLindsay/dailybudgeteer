/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import BudgetContext from "../data/budgetcontext";
import FileDialog from "../filehandling/dialog";

class PageController implements _mithril.MithrilController {

    private fileName: _mithril.MithrilProperty<string>;

    constructor(private context: BudgetContext, private fileDialog: FileDialog) {
        this.fileName = m.prop("");
    }

    newFile = () => {
        this.fileName("");
        this.context.clear();
    };

    saveFile = () => {
        this.fileDialog.save(this.context.writeData(), this.fileName(), this.fileName);
    };

    openFile = () => {
        this.fileDialog.open((data: string, fileName: string) => {
            m.startComputation();
            this.fileName(fileName);
            this.context.loadData(data);
            m.endComputation();
        });
    };
}

export default class Page implements _mithril.MithrilComponent<PageController> {
    public controller: () => PageController;
    public view: _mithril.MithrilView<PageController>;

    constructor(context: BudgetContext, fileDialog: FileDialog, menu: _mithril.MithrilComponent<{}>, body: _mithril.MithrilComponent<{}>) {
        this.controller = () => { return new PageController(context, fileDialog); };
        this.view = (ctrl) => {
            return m("div", [
                m("div.ui.top.attached.menu", [
                    m("div.ui.simple.dropdown.item", [
                        "File",
                        m("i.dropdown.icon"),
                        m("div.menu", [
                            m("div.item", { onclick: ctrl.newFile }, "New"),
                            m("div.item", { onclick: ctrl.openFile }, "Open"),
                            m("div.item", { onclick: ctrl.saveFile }, "Save"),
                            m("div.item", { onclick: ctrl.saveFile }, "Save As")
                        ])
                    ])
                ]),
                m.component(menu),
                m("div.ui.grid.container", m.component(body))
            ]);
        };
    }
}
