import * as m from "mithril";
import * as moment from "moment";
import {ModalComponent, ModalController} from "../components/modal";
import Expense from "./expense";
import Category from "../categories/category";
import {PickCategoryComponent, PickCategoryController} from "../categories/pickcategorycomponent";
import ExpenseController from "./expensecontroller";
import {ChangeDateComponent, ChangeDateController} from "../components/changedatecomponent";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import * as ViewHelpers from "../utils/viewhelpers";
import formatCurrency from "../utils/currencyFormatter";
import * as DF from "../utils/dateFormatter";

export default class ExpenseComponent implements
    m.ClassComponent<ExpenseController> {

    private formComponent: FormComponent;
    private listComponent: ListComponent<Expense>;

    private static renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Category"),
            m("th", "Amount")
        ];
    }

    private static renderItem = (expense: Expense) => {
        return [
            m("td", expense.name()),
            m("td", expense.category().name()),
            m("td", formatCurrency(expense.amount()))
        ];
    }

    private static renderForm = (categoryPicker: PickCategoryComponent,
        categoryPickerController: PickCategoryController, expense) => {
        categoryPickerController.selected = expense.category();
        categoryPickerController.select = (value: Category) => expense.category(value);

        return [
            m("div.field", [
                m("label[for='name']", "Name"),
                m("input[type='text'][id='name'][placeholder='Name'].ui.input",
                    { onchange: m.withAttr("value", expense.name), value: expense.name() })
            ]),
            m(categoryPicker, categoryPickerController),
            m("div.field", [
                m("label[for='day']", "Day"),
                m("input[type='date'][id='day'].ui.input",
                    { onchange: m.withAttr("value", DF.setDate.bind(null, expense.day), null), value: DF.getDate(expense.day) })
            ]),
            m("div.field", [
                m("label[for='amount']", "Amount"),
                m("input[type='number'][id='amount'].ui.input",
                    { onchange: ViewHelpers.withNumber("value", expense.amount), value: expense.amount() })
            ])
        ];
    }

    private static renderFooter = (vm: ExpenseController) => {
        return [
            m("th", [
                m("button[type='button'].ui.primary.button", { onclick: vm.openAddModal }, "Add Expense")
            ]),
            m("th"),
            m("th[colspan='2']", formatCurrency(vm.total()))
        ];
    }

    constructor(private context: BudgetContext) {
        let pickCategoryComponent = new PickCategoryComponent(context);
        let pickCategoryController = new PickCategoryController(context);
        this.formComponent = new FormComponent();

        this.listComponent = new ListComponent<Expense>(
            ExpenseComponent.renderHeader,
            ExpenseComponent.renderItem,
            ExpenseComponent.renderFooter);
    }

    public oninit({attrs}: m.CVnode<ExpenseController>) {
        attrs.day(moment(m.route.param("date")));
    }

    public view = ({attrs}: m.CVnode<ExpenseController>) => {
        var ctrl = attrs;
        return m("div.column", [
            m(new ChangeDateComponent(), new ChangeDateController("/expenses", ctrl.day().clone())),
            m(this.listComponent, ctrl),
            m(new ModalComponent(), new ModalController (
                ctrl.isAddModalOpen,
                ctrl.modalTitle(),
                false,
                () => [this.formComponent.renderForm(ExpenseComponent.renderForm(
                    new PickCategoryComponent(this.context),
                    new PickCategoryController(this.context), ctrl.item()))],
                () => [
                    m("button.ui.approve.button[type='button']", { onclick: ctrl.save }, ctrl.modalActionName()),
                    m("button.ui.cancel.button[type='button]", "Cancel")
                ]))
        ]);
    }
}