import m = require("mithril");
import DataSource from "./datasource";

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

export default class FormComponent<T> implements
    _mithril.MithrilComponent<FormController<T>> {

    public controller: () => FormController<T>;
    public view: _mithril.MithrilView<FormController<T>>;

    constructor(
        source: DataSource<T>,
        renderForm: (item: T) => _mithril.MithrilVirtualElement<{}>
    ) {
        this.controller = () => new FormController<T>(source);
        this.view = (ctrl: FormController<T>) => {
            return m("form.ui.form", [
                renderForm(ctrl.vm.item())
            ]);
        };
    }
}
