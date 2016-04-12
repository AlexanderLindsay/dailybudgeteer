/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as mousetrap from "mousetrap";
import BudgetContext from "../data/budgetcontext";
import FileDialog from "../filehandling/dialog";
import * as FileHandling from "../filehandling/dragdrop";

export class PageModel {

    private fileName: _mithril.MithrilProperty<string>;
    private titleRoot = document.title;

    constructor(root: HTMLElement, private context: BudgetContext, private fileDialog: FileDialog, private fileNameKey: string, filename: string) {
        this.titleRoot = document.title;
        this.fileName = m.prop("");
        this.setFileName(filename);

        this.setupShortcuts();

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

        localStorage.setItem(this.fileNameKey, value);
    };

    newFile = () => {
        m.startComputation();
        this.setFileName("");
        this.context.clear();
        m.endComputation();
    };

    saveFile = () => {
        this.fileDialog.save(this.context.writeData(), this.fileName(), this.setFileName);
    };

    saveFileAs = () => {
        this.fileDialog.save(this.context.writeData(), this.fileName(), this.setFileName, true);
    };

    openFile = () => {
        this.fileDialog.open((data: string, fileName: string) => {
            m.startComputation();
            this.setFileName(fileName);
            this.context.loadData(data);
            m.endComputation();
        });
    };

    setupShortcuts = () => {
        mousetrap.bind("mod+n", this.newFile);
        mousetrap.bind("mod+o", this.openFile);
        mousetrap.bind("mod+s", this.saveFile);
        mousetrap.bind("mod+shift+s", this.saveFileAs);
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
                        m("div.menu.file-menu", [
                            m("div.item", { onclick: ctrl.vm.newFile },
                                [
                                    m("span.text", "New"),
                                    m("span.description", "Ctrl + N")
                                ]),
                            m("div.item", { onclick: ctrl.vm.openFile },
                                [
                                    m("span.text", "Open"),
                                    m("span.description", "Ctrl + O")
                                ]),
                            m("div.item", { onclick: ctrl.vm.saveFile },
                                [
                                    m("span.text", "Save"),
                                    m("span.description", "Ctrl + S")
                                ]),
                            m("div.item", { onclick: ctrl.vm.saveFileAs },
                                [
                                    m("span.text", "Save As"),
                                    m("span.description", "Ctrl + Shift + S")
                                ])
                        ])
                    ]),
                    m("div.ui.simple.dropdown.item", [
                        "Settings",
                        m("div.menu.file-menu", [
                            m("a[href='/categories'].item", { config: m.route }, "Categories")
                        ])
                    ])
                ]),
                m.component(menu),
                m("div.ui.grid.container", m.component(body))
            ]);
        };
    }
}
