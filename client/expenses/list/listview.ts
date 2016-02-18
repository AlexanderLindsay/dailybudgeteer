module ExpenseWidget {
    "use strict";

    export var listView: _mithril.MithrilView<ListController> = (ctrl: ListController) => {
        return m("div", [
            m("table", [
                m("thead", [
                    m("tr", [
                        m("th", "Name"),
                        m("th", "Amount")
                    ])
                ]),
                m("tbody", [
                    ctrl.vm.expenses.map(function(expense, index) {
                        return m("tr", [
                            m("td", expense.name()),
                            m("td", expense.amount()),
                            m("td", [
                                m("button", { onclick: ctrl.vm.editExpense.bind(ctrl.vm, index) }, "Edit"),
                                m("button", { onclick: ctrl.vm.removeExpense.bind(ctrl.vm, index) }, "Remove")
                            ])
                        ])
                    })
                ])
            ])
        ]);
    };
}