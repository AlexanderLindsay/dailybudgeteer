module Rates {
    "use strict";

    export var listView: _mithril.MithrilView<ListRatesController> = (ctrl: ListRatesController) => {
        return m("div", [
            m("table", [
                m("tr", [
                    m("td", "Name"),
                    m("td", "Amount"),
                    m("td", "Days"),
                    m("td", "Amount / Day")
                ]),
                ctrl.vm.activeRates.map(function(rate, index) {
                    return m("tr", [
                        m("td", rate.name()),
                        m("td", rate.amount()),
                        m("td", rate.days()),
                        m("td", rate.perDiem())
                    ])
                })
            ])
        ]);
    };
}