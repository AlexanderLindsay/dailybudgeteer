/// <reference path="expense.ts" />
/// <reference path="expensewidgetcontroller.ts" />
/// <reference path="../components/listcomponent.ts" />
/// <reference path="../components/formcomponent.ts" />

namespace ExpenseWidget {
    "use strict";



    let renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
        ];
    };

    let renderItem = (expense: Expense) => {
        return [
            m("td", expense.name()),
            m("td", expense.amount()),
        ];
    };

    let renderForm = (expense: Expense) => {
        return [
            m("input[type='text']", { onchange: m.withAttr("value", expense.name), value: expense.name() }),
            m("input[type='date']", { onchange: m.withAttr("value", expense.day), value: expense.day() }),
            m("input[type='number']", { onchange: m.withAttr("value", expense.amount), value: expense.amount() })
        ];
    };

    export class ExpenseWidgetComponent implements
        _mithril.MithrilComponent<ExpenseWidgetController> {

        public controller: () => ExpenseWidgetController;
        public view: _mithril.MithrilView<ExpenseWidgetController>;

        constructor(context: Data.Context) {
            this.controller = () => { return new ExpenseWidgetController(context); };
            this.view = (ctrl) => {
                return [
                    m("h1", "Expenses"),
                    m("a[href='/']", { config: m.route }, "View Rates"),
                    m.component(new Components.ListComponent<Expense>(ctrl.source,
                        renderHeader,
                        renderItem)),
                    m.component(new Components.FormComponent<Expense>(ctrl.source, renderForm))
                ];
            };
        }
    }
}