module ExpenseWidget {
    "use strict";

    export var formView: _mithril.MithrilView<FormController> = (ctrl: FormController) => {
        
        var expense = ctrl.vm.expense();
        
        return m("div", [
                m("input[type='text']", { onchange: m.withAttr("value", expense.name), value: expense.name()}),
                m("input[type='date']", {onchange: m.withAttr("value", expense.day), value: expense.day()}),
                m("input[type='number']", { onchange: m.withAttr("value", expense.amount), value: expense.amount()}),
                m("button", {onclick: ctrl.vm.saveExpense}, "Save")
            ]);
    };
}