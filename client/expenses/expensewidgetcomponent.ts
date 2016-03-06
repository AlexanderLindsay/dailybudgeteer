import m = require("mithril");
import moment = require("moment");
import modal from "../components/modal";
import Expense from "./expense";
import ExpenseWidgetController from "./expensewidgetcontroller";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";

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
    return <_mithril.MithrilVirtualElement<{}>>[
        m("div.field", [
            m("label[for='name']", "Name"),
            m("input[type='text'][id='name'][placeholder='Name'].ui.input", { onchange: m.withAttr("value", expense.name), value: expense.name() })
        ]),
        m("div.field", [
            m("label[for='day']", "Day"),
            m("input[type='date'][id='day'].ui.input", { onchange: m.withAttr("value", expense.setDay, null), value: expense.getDay() })
        ]),
        m("div.field", [
            m("label[for='amount']", "Amount"),
            m("input[type='number'][id='amount'].ui.input", { onchange: m.withAttr("value", expense.amount), value: expense.amount() })
        ])
    ];
};

let renderFooter = (ctrl: ExpenseWidgetController) => {
    return m("th[colspan='3']", [
        m("button[type='button'].ui.primary.button", { onclick: ctrl.vm.openAddModal }, "Add Expense")
    ]);
};

export default class ExpenseWidgetComponent implements
    _mithril.MithrilComponent<ExpenseWidgetController> {

    public controller: () => ExpenseWidgetController;
    public view: _mithril.MithrilView<ExpenseWidgetController>;

    constructor(context: BudgetContext) {
        this.controller = () => {
            let date = m.route.param("date");
            let day = moment(date);
            return new ExpenseWidgetController(context, day);
        };
        this.view = (ctrl) => {
            return m("div.column", [
                m.component(new ListComponent<Expense>(ctrl.vm,
                    renderHeader,
                    renderItem,
                    renderFooter.bind(this, ctrl))),
                m.component(new modal(ctrl.vm.modalTitle(), ctrl.vm.isAddModalOpen,
                    () => new FormComponent<Expense>(ctrl.vm, renderForm),
                    () => [
                        m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.save }, ctrl.vm.modalActionName()),
                        m("button.ui.cancel.button[type='button]", "Cancel")
                    ]))
            ]);
        };
    }
}
