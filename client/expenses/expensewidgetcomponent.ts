/// <reference path="expensewidgetcontroller.ts" />
/// <reference path="form/formcomponent.ts" />
/// <reference path="list/listcomponent.ts" />

module ExpenseWidget {
    "use strict";
    
    export class ExpenseWidgetComponent implements
        _mithril.MithrilComponent<ExpenseWidgetController>{

        public controller: () => ExpenseWidgetController;
        public view: _mithril.MithrilView<ExpenseWidgetController>;

        constructor() {
            this.controller = () => { return new ExpenseWidgetController(); };
            this.view = (ctrl) => {
                return [
                    m("a[href='/']", { config: m.route }, "Rates"),
                    m.component(new ListComponent(ctrl.expenses, ctrl.edit, ctrl.remove)),
                    m.component(new FormComponent(ctrl.save, ctrl.expense))
                ]   
            };
        }
    }
}