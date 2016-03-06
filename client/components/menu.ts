import m = require("mithril");

export class MenuItem {
    constructor(public href: string, public name: string) { }

    public isActive = () => {
        return m.route() === this.href;
    };
}

export class MenuController implements _mithril.MithrilController {
    constructor(public menuItems: MenuItem[]) { }
}

export class MenuComponent implements _mithril.MithrilComponent<MenuController> {
    controller: () => MenuController;
    view: _mithril.MithrilView<MenuController>;

    constructor(menuItems: MenuItem[]) {
        this.controller = () => new MenuController(menuItems);
        this.view = (ctrl: MenuController) => {
            return m("div.ui.tabular.menu",
                ctrl.menuItems.map((item: MenuItem) => {
                    let activeCss = item.isActive() ? ".active" : "";
                    return m(`div${activeCss}.item`, { key: item.name }, m(`a[href='${item.href}']`, { config: m.route }, item.name));
                }));
        };
    }
}
