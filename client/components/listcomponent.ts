module Components {
    "use strict";

    export interface DataSource<T> {
        list: () => _mithril.MithrilProperty<T[]>;
        edit: (index: number) => void;
        remove: (index: number) => void;
    }

    class ListViewModel<T> {

        public items: _mithril.MithrilProperty<T[]>;

        private source: DataSource<T>;

        constructor(source: DataSource<T>) {
            this.items = source.list();
            this.source = source;
        }

        public editItem = (index: number) => {
            this.source.edit(index);
        }

        public removeItem = (index: number) => {
            this.source.remove(index);
        }
    }

    class ListController<T> implements _mithril.MithrilController {
        public vm: ListViewModel<T>;

        constructor(source: DataSource<T>) {
            this.vm = new ListViewModel<T>(source);
        }
    }

    export class ListComponent<T> implements
        _mithril.MithrilComponent<ListController<T>>{

        public controller: () => ListController<T>;
        public view: _mithril.MithrilView<ListController<T>>;

        constructor(
            source: DataSource<T>,
            renderHeader: () => _mithril.MithrilVirtualElement<{}>[],
            renderItem: (item: T) => _mithril.MithrilVirtualElement<{}>[]) {

            this.controller = () => new ListController<T>(source);
            this.view = (ctrl: ListController<T>) => {
                return m("div", [
                    m("table", [
                        m("thead", [
                            m("tr", [
                                renderHeader(),
                                m("td", "")
                            ])
                        ]),
                        m("tbody", [
                            ctrl.vm.items().map(function(item, index) {
                                return m("tr", [
                                    renderItem(item),
                                    m("td", [
                                        m("button", { onclick: ctrl.vm.editItem.bind(ctrl.vm, index) }, "Edit"),
                                        m("button", { onclick: ctrl.vm.removeItem.bind(ctrl.vm, index) }, "Remove")
                                    ])
                                ]);
                            })
                        ])
                    ])
                ]);
            };
        }
    }
}