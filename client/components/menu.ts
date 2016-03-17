/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";

export class MenuItem {
    constructor(private activeMatcher: RegExp, public href: string, public name: string) { }

    public isActive = () => {
        return this.activeMatcher.test(m.route());
    };
}

export class MenuComponent implements _mithril.MithrilComponent<{}> {
    controller: () => Object;
    view: _mithril.MithrilView<{}>;

    constructor(menuItems: MenuItem[]) {
        this.controller = () => { return {}; };
        this.view = () => {
            return m("div.ui.tabular.menu",
                menuItems.map((item: MenuItem) => {
                    let activeCss = item.isActive() ? "active" : "";
                    return m(`div.item`, { "class": activeCss, key: item.name }, m("a", { href: item.href, config: m.route }, item.name));
                }));
        };
    }
}
