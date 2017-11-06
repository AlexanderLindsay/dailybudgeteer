import * as m from "mithril";
import * as prop from "mithril/stream";
import * as moment from "moment";
import * as DF from "../utils/dateFormatter";

export class ChangeDateController {

    public date: prop.Stream<moment.Moment>;
    public editableDate: prop.Stream<moment.Moment>;
    public isEdit: prop.Stream<boolean>;

    constructor(public baseUrl: string) {
        this.date = prop(moment());
        this.editableDate = prop(this.date().clone());
        this.isEdit = prop(false);
    }

    public startEdit = () => {
        this.editableDate(this.date().clone());
        this.isEdit(true);
    }

    public setDate = (value: string) => {
        let d = moment(value, DF.formats.pickerFormat);
        if (d.isValid()) {
            this.editableDate(d);
        }
    }

    public changeDate = () => {
        const d = this.editableDate();
        if (d.isValid()) {
            const url = this.dateToUrl(d);
            this.isEdit(false);
            m.route.set(url);
        }
    }

    public dateToUrl = (date: moment.Moment) => {
        return `${this.baseUrl}/${DF.formatDateForUrl(date)}`;
    }
}

export class ChangeDateComponent implements m.ClassComponent<ChangeDateController> {
    public view(node: m.CVnode<ChangeDateController>) {
        let ctrl = node.attrs;
        return m("div.ui.segment",
            m("div.ui.grid", [
                m("div.two.wide.column",
                    m("div.ui.basic.left.aligned.segment",
                        m("h2.ui.header",
                            m("a", {
                                href: ctrl.dateToUrl(ctrl.date().clone().subtract(1, "day")),
                                oncreate: m.route.link
                            }, m("i.arrow.left.icon"))
                        )
                    )
                ),
                m("div.twelve.wide.column",
                    m("div.ui.basic.center.aligned.segment",
                        !ctrl.isEdit() ?
                            m("h2.ui.header",
                                m("a[href='#']", { onclick: () => ctrl.startEdit() }, DF.formatDateForDisplay(ctrl.date()))
                            ) :
                            m("div.ui.action input", [
                                m("input[type='date']", {
                                    onchange: m.withAttr("value", ctrl.setDate, null),
                                    value: DF.formatDateForPicker(ctrl.editableDate())
                                }),
                                m("button[type='button'].ui.button", { onclick: ctrl.changeDate }, "Change Date")
                            ])
                    )
                ),
                m("div.two.wide.column",
                    m("div.ui.basic.right.aligned.segment",
                        m("h2.ui.header",
                            m("a", {
                                href: ctrl.dateToUrl(ctrl.date().clone().add(1, "day")),
                                oncreate: m.route.link
                            }, m("i.arrow.right.icon"))
                        )
                    )
                )
            ])
        );
    }
}