import * as m from "mithril";
import * as prop from "mithril/stream";
import * as ViewHelpers from "../utils/viewhelpers";

export interface IMenuItem {
    isActive(): boolean;
    render(): Array<m.CVnode<any>>;
}

export class BasicMenuItem implements IMenuItem {
    constructor(private activeMatcher: RegExp, private href: string, private name: string) { }

    public isActive = () => {
        return this.activeMatcher.test(m.route.get());
    }

    public render = () => {
        let activeCss = this.isActive() ? "active" : "";
        return [m(`a.item`,
            { "class": activeCss, key: this.name, href: this.href, oncreate: m.route.link },
            this.name)];
    }
}

export class DropdownMenuItem implements IMenuItem {
    constructor(private activeMatcher: RegExp,
        private name: string,
        private subMenuItems: Array<IMenuItem>) { }

    public isActive = () => {
        return this.activeMatcher.test(m.route.get());
    }

    public render = () => {
        let activeCss = this.isActive() ? "active-menu-dropdown" : "";
        return [m(`div.ui.simple.dropdown.item`,
            {
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
            ])];
    }
}

export class MenuController {
    constructor(public items: Array<any>) { }
}

export class MenuComponent implements m.ClassComponent<MenuController> {
    public view(node: m.CVnode<MenuController>) {
        let ctrl = node.attrs;
        return m("div.ui.tabular.menu",
        ctrl.items.map((item) => {
            return item.render();
        }));
    }
}
