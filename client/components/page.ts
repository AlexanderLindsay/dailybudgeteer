/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import BudgetContext from "../data/budgetcontext";
import FileDialog from "../filehandling/dialog";
import * as FileHandling from "../filehandling/dragdrop";

export class PageModel {
    private static FileNameKey = "BudgetFileName";

    private fileName: _mithril.MithrilProperty<string>;
    private titleRoot = document.title;

    constructor(root: HTMLElement, private context: BudgetContext, private fileDialog: FileDialog) {
        this.titleRoot = document.title;
        this.fileName = m.prop("");
        this.setFileName(localStorage.getItem(PageModel.FileNameKey) || "");

        let handler = new FileHandling.FileHandler(root, {
            onchange: (files: FileList) => {
                let reader = new FileReader();
                let filename = "";
                reader.onload = (e: Event) => {
                    let data = reader.result;
                    m.startComputation();
                    this.setFileName(filename);
                    context.loadData(data);
                    m.endComputation();
                };

                if (files.length > 0) {
                    let file = files[0];
                    filename = file.name;
                    reader.readAsText(file);
                }
            }
        });
    }

    private setFileName = (value: string) => {
        this.fileName(value);

        if (value.length > 0) {
            document.title = `${this.titleRoot} - ${value}`;
        } else {
            document.title = this.titleRoot;
        }

        localStorage.setItem(PageModel.FileNameKey, value);
    };

    newFile = () => {
        this.setFileName("");
        this.context.clear();
    };

    saveFile = () => {
        this.fileDialog.save(this.context.writeData(), this.fileName(), this.setFileName);
    };

    openFile = () => {
        this.fileDialog.open((data: string, fileName: string) => {
            m.startComputation();
            this.setFileName(fileName);
            this.context.loadData(data);
            m.endComputation();
        });
    };
}

class PageController implements _mithril.MithrilController {

    constructor(public vm: PageModel) { }

}

export class Page implements _mithril.MithrilComponent<PageController> {
    public controller: () => PageController;
    public view: _mithril.MithrilView<PageController>;

    constructor(model: PageModel, menu: _mithril.MithrilComponent<{}>, body: _mithril.MithrilComponent<{}>) {
        this.controller = () => { return new PageController(model); };
        this.view = (ctrl) => {
            return m("div", [
                m("div.ui.top.attached.menu", [
                    m("div.ui.simple.dropdown.item", [
                        "File",
                        m("i.dropdown.icon"),
                        m("div.menu", [
                            m("div.item", { onclick: ctrl.vm.newFile }, "New"),
                            m("div.item", { onclick: ctrl.vm.openFile }, "Open"),
                            m("div.item", { onclick: ctrl.vm.saveFile }, "Save"),
                            m("div.item", { onclick: ctrl.vm.saveFile }, "Save As")
                        ])
                    ])
                ]),
                m.component(menu),
                m("div.ui.grid.container", m.component(body))
            ]);
        };
    }
}
