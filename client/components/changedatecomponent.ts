/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";

class ChangeDateController implements _mithril.MithrilController {
    constructor(public date: moment.Moment) { }
}

export default class ChangeDateComponent implements _mithril.MithrilComponent<ChangeDateController> {
    public controller: (date: moment.Moment) => ChangeDateController;
    public view: _mithril.MithrilView<ChangeDateController>;

    constructor(baseUrl: string) {
        this.controller = (date) => {
            return new ChangeDateController(date);
        };
        this.view = (ctrl) => {
            return m("div.ui.segment",
                m("div.ui.grid", [
                    m("div.two.wide.column",
                        m("div.ui.basic.left.aligned.segment",
                            m("h2.ui.header",
                                m("a", { href: `${baseUrl}/${ctrl.date.clone().subtract(1, "day").format("YYYY-MM-DD")}`, config: m.route }, m("i.arrow.left.icon"))
                            )
                        )
                    ),
                    m("div.twelve.wide.column",
                        m("div.ui.basic.center.aligned.segment",
                            m("h2.ui.header",
                                m("span", ctrl.date.format("dddd, MMMM Do YYYY"))
                            )
                        )
                    ),
                    m("div.two.wide.column",
                        m("div.ui.basic.right.aligned.segment",
                            m("h2.ui.header",
                                m("a", { href: `${baseUrl}/${ctrl.date.clone().add(1, "day").format("YYYY-MM-DD")}`, config: m.route }, m("i.arrow.right.icon"))
                            )
                        )
                    )
                ])
            );
        };
    }
}