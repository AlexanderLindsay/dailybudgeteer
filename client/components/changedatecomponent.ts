import * as m from "mithril";
import * as prop from "mithril/stream";
import * as moment from "moment";
import * as DF from "../utils/dateFormatter";

class ChangeDateViewModel {

    public date: prop.Stream<moment.Moment>;
    public isEdit: prop.Stream<boolean>;

    constructor(public baseUrl: string, date: moment.Moment) {
        this.date = prop(date);
        this.isEdit = prop(false);
    }

    public setDate = (value: string) => {
        let d = moment(value, DF.formats.pickerFormat);
        if (d.isValid()) {
            this.date(d);
        }
    }

    public changeDate = () => {
        const d = this.date();
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

export class ChangeDateController {

    public vm: ChangeDateViewModel;

    constructor(baseUrl: string, date: moment.Moment) {
        this.vm = new ChangeDateViewModel(baseUrl, date);
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
                                href: ctrl.vm.dateToUrl(ctrl.vm.date().clone().subtract(1, "day")),
                                oncreate: m.route.link
                            }, m("i.arrow.left.icon"))
                        )
                    )
                ),
                m("div.twelve.wide.column",
                    m("div.ui.basic.center.aligned.segment",
                        !ctrl.vm.isEdit() ?
                            m("h2.ui.header",
                                m("a[href='#']", { onclick: () => ctrl.vm.isEdit(true) }, DF.formatDateForDisplay(ctrl.vm.date()))
                            ) :
                            m("div.ui.action input", [
                                m("input[type='date']", {
                                    onchange: m.withAttr("value", ctrl.vm.setDate, null),
                                    value: DF.formatDateForPicker(ctrl.vm.date())
                                }),
                                m("button[type='button'].ui.button", { onclick: ctrl.vm.changeDate }, "Change Date")
                            ])
                    )
                ),
                m("div.two.wide.column",
                    m("div.ui.basic.right.aligned.segment",
                        m("h2.ui.header",
                            m("a", {
                                href: ctrl.vm.dateToUrl(ctrl.vm.date().clone().add(1, "day")),
                                oncreate: m.route.link
                            }, m("i.arrow.right.icon"))
                        )
                    )
                )
            ])
        );
    }
}