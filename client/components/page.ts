import * as m from "mithril";
import * as prop from "mithril/stream";
import * as mousetrap from "mousetrap";
import BudgetContext from "../data/budgetcontext";
import FileDialog from "../filehandling/dialog";
import * as FileHandling from "../filehandling/dragdrop";

export class PageModel {

    private fileName: prop.Stream<string>;
    private titleRoot = document.title;

    constructor(root: HTMLElement, private context: BudgetContext,
        private fileDialog: FileDialog, private fileNameKey: string, filename: string) {

        this.titleRoot = document.title;
        this.fileName = prop("");
        this.setFileName(filename);

        this.setupShortcuts();

        let handler = new FileHandling.FileHandler(root, {
            onchange: (files: FileList) => {
                let reader = new FileReader();
                let filename = "";
                reader.onload = (e: Event) => {
                    let data = reader.result;
                    this.setFileName(filename);
                    context.loadData(data);
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
    }

    newFile = () => {
        this.setFileName("");
        this.context.clear();
    }

    saveFile = () => {
        this.fileDialog.save(this.context.writeData(), this.fileName(), this.setFileName);
    }

    saveFileAs = () => {
        this.fileDialog.save(this.context.writeData(), this.fileName(), this.setFileName, true);
    }

    openFile = () => {
        this.fileDialog.open((data: string, fileName: string) => {
            this.setFileName(fileName);
            this.context.loadData(data);
        });
    }

    setupShortcuts = () => {
        mousetrap.bind("mod+n", () => { this.newFile(); });
        mousetrap.bind("mod+o", () => { this.openFile(); });
        mousetrap.bind("mod+s", () => { this.saveFile(); });
        mousetrap.bind("mod+shift+s", () => { this.saveFileAs(); });
    }
}

export class PageController<M,B> {
    constructor(public vm: PageModel, public menu: m.CVnode<M>, public body: m.CVnode<B> ) { }
}

export class PageComponent<M,B> implements m.ClassComponent<PageController<M,B>> {

    public view ({attrs}: m.CVnode<PageController<M,B>>) {
        let ctrl = attrs;
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
                        m("a[href='/categories'].item", { oncreate: m.route.link }, "Categories")
                    ])
                ])
            ]),
            ctrl.menu,
            m("div.ui.grid.container", ctrl.body)
        ]);
    }
}
