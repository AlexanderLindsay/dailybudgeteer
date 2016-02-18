module RateWidget {
    "use strict";

    export var listView: _mithril.MithrilView<ListController> = (ctrl: ListController) => {
        return m("div", [
            m("table", [
                m("thead", [
                    m("tr", [
                        m("th", "Name"),
                        m("th", "Amount"),
                        m("th", "Days"),
                        m("th", "Amount / Day"),
                        m("th", "")
                    ])
                ]),
                m("tbody", [
                    ctrl.vm.rates.map(function(rate, index) {
                        return m("tr", [
                            m("td", rate.name()),
                            m("td", rate.amount()),
                            m("td", rate.days()),
                            m("td", rate.perDiem()),
                            m("td", [
                                m("button", { onclick: ctrl.vm.editRate.bind(ctrl.vm, index) }, "Edit"),
                                m("button", { onclick: ctrl.vm.removeRate.bind(ctrl.vm, index) }, "Remove")
                            ])
                        ])
                    })
                ])
            ]),
            m("div", `Daily Rate: ${ctrl.vm.total()}`)
        ]);
    };
}