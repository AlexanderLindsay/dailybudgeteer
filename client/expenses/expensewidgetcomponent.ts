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
            m("div.field", [
                m("label[for='name']", "Name"),
                m("input[type='text'][id='name'][placeholder='Name'].ui.input", { onchange: m.withAttr("value", expense.name), value: expense.name() })
            ]),
            m("div.field", [
                m("label[for='day']", "Day"),
                m("input[type='date'][id='day'].ui.input", { onchange: m.withAttr("value", expense.day), value: expense.day() })
            ]),
            m("div.field", [
                m("label[for='amount']", "Amount"),
                m("input[type='number'][id='amount'].ui.input", { onchange: m.withAttr("value", expense.amount), value: expense.amount() })
            ])
        ];
    };

    export class ExpenseWidgetComponent implements
        _mithril.MithrilComponent<ExpenseWidgetController> {

        public controller: () => ExpenseWidgetController;
        public view: _mithril.MithrilView<ExpenseWidgetController>;

        constructor(context: Data.BudgetContext) {
            this.controller = () => { return new ExpenseWidgetController(context); };
            this.view = (ctrl) => {
                return m("div.column", [
                    m.component(new Components.ListComponent<Expense>(ctrl.source,
                        renderHeader,
                        renderItem)),
                    m.component(new Components.FormComponent<Expense>(ctrl.source, renderForm))
                ]);
            };
        }
    }
}