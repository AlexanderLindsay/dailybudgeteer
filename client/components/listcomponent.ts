import * as m from "mithril";
import * as prop from "mithril/stream";
import IDataSource from "./datasource";
import IKeyed from "../data/keyed";

export default class ListComponent<T extends IKeyed> implements
    m.ClassComponent<Array<T>> {

    constructor(
        private renderHeader: (args: any) => Array<m.CVnode<T>>,
        private renderItem: (item: T, args: any) => Array<m.CVnode<T>>,
        private renderFooter: (args: any) => Array<m.CVnode<T>> = () => [] ) { }

    private renderActions(item: T, args: any) {
        const id = item.id();

        let actions: Array<m.CVnode<T>> = [];
        if (args.allowEdit(id)) {
            actions.push(m("button.ui.button", { onclick: () => args.edit(id) }, "Edit"));
        }

        if (args.allowRemove(id)) {
            actions.push(m("button.ui.button", { onclick: () => args.remove(id) }, "Remove"));
        }

        return actions;
    }

    public view = ({attrs}: m.CVnode<any>) => {
        return m("div", [
            m("table.ui.striped.table", [
                m("thead", [
                    m("tr", [
                        this.renderHeader(attrs),
                        m("th", "")
                    ])
                ]),
                m("tbody", [
                    attrs.list().map((item: T, index: number) => {
                        return m("tr", { key: item.id() }, [
                            this.renderItem(item, attrs),
                            m("td", { key: -1 }, this.renderActions(item, attrs))
                        ]);
                    })
                ]),
                m("tfoot.full.width", m("tr", this.renderFooter(attrs)))
            ])
        ]);
    }
}