import * as m from "mithril";

export default class FormComponent {
    public renderForm = (node: Array<m.CVnode<any>>) => {
        return m("form.ui.form", node);
    }
}
