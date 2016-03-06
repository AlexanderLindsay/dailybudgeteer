/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import DataSource from "./datasource";
import IKeyed from "../data/keyed";

export default class ListComponent<T extends IKeyed> implements
    _mithril.MithrilComponent<{}> {

    constructor(
        private renderHeader: (args: any) => _mithril.MithrilVirtualElement<{}>,
        private renderItem: (item: T, args: any) => _mithril.MithrilVirtualElement<{}>,
        private renderFooter: (args: any) => _mithril.MithrilVirtualElement<{}> = () => []) { }

    private renderActions(item: T, args: any) {
        const id = item.id();

        let actions: _mithril.MithrilVirtualElement<{}>[] = [];
        if (args.allowEdit(id)) {
            actions.push(m("button.ui.button", { onclick: args.edit.bind(args, id) }, "Edit"));
        }

        if (args.allowRemove(id)) {
            actions.push(m("button.ui.button", { onclick: args.remove.bind(args, id) }, "Remove"));
        }

        return actions;
    }

    public controller = () => {
        return {};
    };

    public view = (ctrl: any, args: any) => {
        return m("div", [
            m("table.ui.striped.table", [
                m("thead", [
                    m("tr", [
                        this.renderHeader(args),
                        m("th", "")
                    ])
                ]),
                m("tbody", [
                    args.list().map((item: T, index: number) => {
                        return m("tr", { key: item.id() }, [
                            this.renderItem(item, args),
                            m("td", { key: -1 }, this.renderActions(item, args))
                        ]);
                    })
                ]),
                m("tfoot.full.width", m("tr", this.renderFooter(args)))
            ])
        ]);
    };
}