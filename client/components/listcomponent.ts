import m = require("mithril");
import DataSource from "./datasource";
import IKeyed from "../data/keyed";

class ListController<T> implements _mithril.MithrilController {

    public list: _mithril.MithrilPromise<T[]>;

    constructor(source: DataSource<T>) {
        this.list = source.list();
    }
}

export default class ListComponent<T extends IKeyed> implements
    _mithril.MithrilComponent<ListController<T>> {

    constructor(
        private source: DataSource<T>,
        private renderHeader: () => _mithril.MithrilVirtualElement<{}>,
        private renderItem: (item: T) => _mithril.MithrilVirtualElement<{}>,
        private renderFooter: () => _mithril.MithrilVirtualElement<{}> = () => []) { }

    private renderActions(item: T) {
        const id = item.id();

        let actions: _mithril.MithrilVirtualElement<{}>[] = [];
        if (this.source.allowEdit(id)) {
            actions.push(m("button.ui.button", { onclick: this.source.edit.bind(this.source, id) }, "Edit"));
        }

        if (this.source.allowRemove(id)) {
            actions.push(m("button.ui.button", { onclick: this.source.remove.bind(this.source, id) }, "Remove"));
        }

        return actions;
    }

    public controller = () => {
        return new ListController<T>(this.source);
    };

    public view = (ctrl: ListController<T>) => {
        return m("div", [
            m("table.ui.striped.table", [
                m("thead", [
                    m("tr", [
                        this.renderHeader(),
                        m("th", "")
                    ])
                ]),
                m("tbody", [
                    ctrl.list().map((item, index) => {
                        return m("tr", { key: item.id() }, [
                            this.renderItem(item),
                            m("td", { key: -1 }, this.renderActions(item))
                        ]);
                    })
                ]),
                m("tfoot.full.width", m("tr", this.renderFooter()))
            ])
        ]);
    };
}