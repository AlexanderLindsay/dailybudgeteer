import DataSource from "./datasource";
import IKeyed from "../data/keyed";

class ListViewModel<T extends IKeyed> {

    public items: _mithril.MithrilPromise<T[]>;

    constructor(private source: DataSource<T>) {
        this.items = source.list();
        this.source = source;
    }

    public editItem = (id: number) => {
        this.source.edit(id);
    };

    public removeItem = (id: number) => {
        this.source.remove(id);
    };
}

class ListController<T extends IKeyed> implements _mithril.MithrilController {
    public vm: ListViewModel<T>;

    constructor(source: DataSource<T>) {
        this.vm = new ListViewModel<T>(source);
    }
}

export default class ListComponent<T extends IKeyed> implements
    _mithril.MithrilComponent<ListController<T>> {

    public controller: () => ListController<T>;
    public view: _mithril.MithrilView<ListController<T>>;

    constructor(
        source: DataSource<T>,
        renderHeader: () => _mithril.MithrilVirtualElement<{}>[],
        renderItem: (item: T) => _mithril.MithrilVirtualElement<{}>[]) {

        this.controller = () => new ListController<T>(source);
        this.view = (ctrl: ListController<T>) => {
            return m("div", [
                m("table.ui.striped.table", [
                    m("thead", [
                        m("tr", [
                            renderHeader(),
                            m("th", "")
                        ])
                    ]),
                    m("tbody", [
                        ctrl.vm.items().map(function(item, index) {
                            return m("tr", [
                                renderItem(item),
                                m("td", [
                                    m("button.ui.button", { onclick: ctrl.vm.editItem.bind(ctrl.vm, item.id()) }, "Edit"),
                                    m("button.ui.button", { onclick: ctrl.vm.removeItem.bind(ctrl.vm, item.id()) }, "Remove")
                                ])
                            ]);
                        })
                    ])
                ])
            ]);
        };
    }
}
