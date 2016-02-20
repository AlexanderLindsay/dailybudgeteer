/// <reference path="datasource.ts" />

namespace Components {
    "use strict";

    class FormViewModel<T> {

        public item: _mithril.MithrilProperty<T>;

        constructor(private source: DataSource<T>) {
            this.item = source.item;
        }

        public saveItem = () => {
            this.source.save();
        };
    }

    class FormController<T> implements _mithril.MithrilController {
        public vm: FormViewModel<T>;

        constructor(source: DataSource<T>) {
            this.vm = new FormViewModel<T>(source);
        }
    }

    export class FormComponent<T> implements
        _mithril.MithrilComponent<FormController<T>> {

        public controller: () => FormController<T>;
        public view: _mithril.MithrilView<FormController<T>>;

        constructor(
            source: DataSource<T>,
            renderForm: (item: T) => _mithril.MithrilVirtualElement<{}>[]
        ) {
            this.controller = () => new FormController<T>(source);
            this.view = (ctrl: FormController<T>) => {
                return m("div", [
                    renderForm(ctrl.vm.item()),
                    m("button", { onclick: ctrl.vm.saveItem}, "Save")
                ]);
            };
        }
    }
}