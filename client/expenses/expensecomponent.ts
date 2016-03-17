/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import modal from "../components/modal";
import Expense from "./expense";
import {ExpenseDataSource, ExpenseController} from "./expensecontroller";
import ChangeDateComponent from "../components/changedatecomponent";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import * as ViewHelpers from "../viewhelpers";

export default class ExpenseComponent implements
    _mithril.MithrilComponent<ExpenseController> {

    private changeDateComponent: ChangeDateComponent;
    private formComponent: FormComponent<Expense>;
    private listComponent: ListComponent<Expense>;

    private static renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
        ];
    };

    private static renderItem = (expense: Expense) => {
        return [
            m("td", expense.name()),
            m("td", expense.amount()),
        ];
    };

    private static renderForm = (expense: Expense) => {
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
                m("input[type='number'][id='amount'].ui.input", { onchange: ViewHelpers.withNumber("value", expense.amount), value: expense.amount() })
            ])
        ];
    };

    private static renderFooter = (vm: ExpenseDataSource) => {
        return [
            m("th", [
                m("button[type='button'].ui.primary.button", { onclick: vm.openAddModal }, "Add Expense")
            ]),
            m("th[colspan='2']", vm.total())
        ];
    };

    constructor(private context: BudgetContext) {
        this.changeDateComponent = new ChangeDateComponent("/expenses");
        this.formComponent = new FormComponent<Expense>(ExpenseComponent.renderForm);
        this.listComponent = new ListComponent<Expense>(
            ExpenseComponent.renderHeader,
            ExpenseComponent.renderItem,
            ExpenseComponent.renderFooter);
    }

    public controller = () => {
        let date = m.route.param("date");
        let day = moment(date);
        return new ExpenseController(this.context, day);
    };

    public view = (ctrl: ExpenseController) => {
        return m("div.column", [
            m.component(this.changeDateComponent, ctrl.vm.day.clone()),
            m.component(this.listComponent, ctrl.vm),
            m.component(new modal(ctrl.vm.modalTitle(), ctrl.vm.isAddModalOpen,
                () => m.component(this.formComponent, { item: ctrl.vm.item }),
                () => [
                    m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.save }, ctrl.vm.modalActionName()),
                    m("button.ui.cancel.button[type='button]", "Cancel")
                ]))
        ]);
    };
}