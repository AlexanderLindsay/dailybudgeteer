/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as ViewHelpers from "../utils/viewhelpers";

export interface IMenuItem {
    isActive(): boolean;
    render(): _mithril.MithrilVirtualElement<{}>;
}

export class BasicMenuItem implements IMenuItem {
    constructor(private activeMatcher: RegExp, private href: string, private name: string) { }

    public isActive = () => {
        return this.activeMatcher.test(m.route());
    };

    public render = () => {
        let activeCss = this.isActive() ? "active" : "";
        return m(`a.item`,
            { "class": activeCss, key: this.name, href: this.href, config: m.route },
            this.name);
    };
}

export class DropdownMenuItem implements IMenuItem {
    constructor(private activeMatcher: RegExp,
        private name: string,
        private subMenuItems: IMenuItem[]) { }

    public isActive = () => {
        return this.activeMatcher.test(m.route());
    };

    public render = () => {
        let activeCss = this.isActive() ? "active-menu-dropdown" : "";
        return m(`div.ui.dropdown.item`,
            {
                config: ViewHelpers.createDropdown(),
                "class": activeCss,
                key: this.name
            },
            [
                m("span", this.name),
                m("i.dropdown.icon"),
                m("div.menu",
                    this.subMenuItems.map((item: IMenuItem) => {
                        return item.render();
                    }))
            ]);
    };
}

export class MenuComponent implements _mithril.MithrilComponent<{}> {
    controller: () => Object;
    view: _mithril.MithrilView<{}>;

    constructor(menuItems: IMenuItem[]) {
        this.controller = () => { return {}; };
        this.view = () => {
            return m("div.ui.tabular.menu",
                menuItems.map((item: IMenuItem) => {
                    return item.render();
                }));
        };
    }
}
