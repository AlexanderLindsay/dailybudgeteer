import m = require("mithril");
import DataSource from "./datasource";

export default class FormComponent<T> implements
    _mithril.MithrilComponent<{}> {

    constructor(private renderForm: (item: T) => _mithril.MithrilVirtualElement<{}>) { }

    public controller = () => {
        return {};
    };

    public view = (ctrl: {}, args: any) => {
        return m("form.ui.form", [
            this.renderForm(args.item())
        ]);
    };
}
