/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import DataSource from "./datasource";

export default class FormComponent<T> implements
    _mithril.MithrilComponent<{}> {

    constructor(private renderForm: (args: {item: T}) => _mithril.MithrilVirtualElement<{}>) { }

    public controller = () => {
        return {};
    };

    public view = (ctrl: {}, args: {item: T}) => {
        return m("form.ui.form", [
            this.renderForm(args)
        ]);
    };
}
