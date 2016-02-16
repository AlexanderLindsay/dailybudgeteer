module RateWidget {
    "use strict";

    export var listView: _mithril.MithrilView<ListRatesController> = (ctrl: ListRatesController) => {
        return m("div", [
            m("table", [
                m("tr", [
                    m("td", "Name"),
                    m("td", "Amount"),
                    m("td", "Days"),
                    m("td", "Amount / Day"),
                    m("td", "")
                ]),
                ctrl.vm.rates.map(function(rate, index) {
                    return m("tr", [
                        m("td", rate.name()),
                        m("td", rate.amount()),
                        m("td", rate.days()),
                        m("td", rate.perDiem()),
                        m("td", [
                            m("button", {onclick: ctrl.vm.editRate.bind(ctrl.vm, index)}, "Edit"),
                            m("button", {onclick: ctrl.vm.removeRate.bind(ctrl.vm, index)}, "Remove")
                        ])
                    ])
                })
            ]),
        ]);
    };
}