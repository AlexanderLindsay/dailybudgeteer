/// <reference path="expensewidgetcontroller.ts" />
/// <reference path="form/formcomponent.ts" />
/// <reference path="../components/listcomponent.ts" />

module ExpenseWidget {
    "use strict";

    class ExpenseDataSource implements Components.DataSource<Expense> {
        list: () => _mithril.MithrilProperty<Expense[]>;
        edit: (index: number) => void;
        remove: (index: number) => void;

        constructor(expenses: Expense[], edit: (index: number) => void, remove: (index: number) => void) {
            this.list = () => m.prop(expenses);
            this.edit = edit;
            this.remove = remove;
        }
    }

    var renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
        ];
    }

    var renderItem = (expense: Expense) => {
        return [
            m("td", expense.name()),
            m("td", expense.amount()),
        ];
    }

    export class ExpenseWidgetComponent implements
        _mithril.MithrilComponent<ExpenseWidgetController>{

        public controller: () => ExpenseWidgetController;
        public view: _mithril.MithrilView<ExpenseWidgetController>;

        constructor() {
            this.controller = () => { return new ExpenseWidgetController(); };
            this.view = (ctrl) => {
                return [
                    m("a[href='/']", { config: m.route }, "Rates"),
                    m.component(new Components.ListComponent<Expense>(
                        new ExpenseDataSource(ctrl.expenses, ctrl.edit, ctrl.remove),
                        renderHeader,
                        renderItem)),
                    m.component(new FormComponent(ctrl.save, ctrl.expense))
                ]
            };
        }
    }
}