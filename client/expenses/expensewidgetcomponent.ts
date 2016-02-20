/// <reference path="expense.ts" />
/// <reference path="expensewidgetcontroller.ts" />
/// <reference path="../components/listcomponent.ts" />
/// <reference path="../components/formcomponent.ts" />

namespace ExpenseWidget {
    "use strict";

    class ExpenseDataSource implements Components.DataSource<Expense> {
        item: _mithril.MithrilProperty<Expense>;
        list: () => _mithril.MithrilPromise<Expense[]>;
        edit: (index: number) => void;
        remove: (index: number) => void;
        save: () => void;

        constructor(
            expense: _mithril.MithrilProperty<Expense>,
            expenses: Expense[],
            edit: (index: number) => void,
            remove: (index: number) => void,
            save: () => void) {
            this.item = expense;
            this.list = () => {
                let deferred = m.deferred<Expense[]>();
                deferred.resolve(expenses);
                return deferred.promise;
            };
            this.edit = edit;
            this.remove = remove;
            this.save = save;
        }
    }

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

        constructor() {
            this.controller = () => { return new ExpenseWidgetController(); };
            this.view = (ctrl) => {
                let source = new ExpenseDataSource(
                    ctrl.expense,
                    ctrl.expenses,
                    ctrl.edit,
                    ctrl.remove,
                    ctrl.save
                );
                return [
                    m("a[href='/']", { config: m.route }, "Rates"),
                    m.component(new Components.ListComponent<Expense>(source,
                        renderHeader,
                        renderItem)),
                    m.component(new Components.FormComponent<Expense>(source, renderForm))
                ];
            };
        }
    }
}