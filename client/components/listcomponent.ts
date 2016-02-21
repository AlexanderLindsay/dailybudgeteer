/// <reference path="datasource.ts" />

namespace Components {
    "use strict";

    class ListViewModel<T extends Data.IKeyed> {

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

    class ListController<T extends Data.IKeyed> implements _mithril.MithrilController {
        public vm: ListViewModel<T>;

        constructor(source: DataSource<T>) {
            this.vm = new ListViewModel<T>(source);
        }
    }

    export class ListComponent<T extends Data.IKeyed> implements
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
                                        m("button", { onclick: ctrl.vm.editItem.bind(ctrl.vm, item.id()) }, "Edit"),
                                        m("button", { onclick: ctrl.vm.removeItem.bind(ctrl.vm, item.id()) }, "Remove")
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