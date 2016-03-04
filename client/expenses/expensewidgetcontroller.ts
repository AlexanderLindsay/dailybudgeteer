import moment = require("moment");
import Expense from "./expense";
import BudgetContext from "../data/budgetcontext";
import DataSource from "../components/datasource";

const saveTitle = "Add Expense";
const saveActionName = "Add";
const editTitle = "Edit Expense";
const editActionName = "Save";

class ExpenseDataSource implements DataSource<Expense> {
    item: _mithril.MithrilProperty<Expense>;
    isAddModalOpen: _mithril.MithrilProperty<Boolean>;
    modalTitle: _mithril.MithrilProperty<string>;
    modalActionName: _mithril.MithrilProperty<string>;

    constructor(private context: BudgetContext, private day: moment.Moment) {
        this.item = m.prop(new Expense("", this.day, 0));
        this.isAddModalOpen = m.prop(false);
        this.modalTitle = m.prop(saveTitle);
        this.modalActionName = m.prop(saveActionName);
    }

    public list = () => {
        let perDiem = this.context.listRates().reduce<number>((previous, current, index) => {
            return previous + current.perDiem(this.day);
        }, 0);

        let expenses: Expense[] = [];
        if (perDiem !== 0) {
            expenses.push(new Expense("Base", this.day, perDiem));
        }

        expenses = expenses.concat(this.context.listExpenses().filter((exp) => {
            const expDate = exp.day();
            const day = this.day;
            return expDate.isSame(day, "day");
        }));

        let deferred = m.deferred<Expense[]>();
        deferred.resolve(expenses);

        return deferred.promise;
    };

    public edit = (id: number) => {
        let expense = this.context.getExpense(id);
        if (expense === null) {
            this.item(new Expense("", this.day, 0));
        } else {
            this.item(expense.clone());
        }

        this.modalTitle(editTitle);
        this.modalActionName(editActionName);
        this.isAddModalOpen(true);
    };

    public remove = (id: number) => {
        this.context.removeExpense(id);
    };

    public save = () => {
        if (this.item().id() === 0) {
            this.context.addExpense(this.item());
        } else {
            let modified = this.item();
            let current = this.context.getExpense(modified.id());
            current.name(modified.name());
            current.day(modified.day());
            current.amount(modified.amount());
        }
    };

    public openAddModal = () => {
        this.item(new Expense("", this.day, 0));
        this.modalTitle(saveTitle);
        this.modalActionName(saveActionName);
        this.isAddModalOpen(true);
    };
}

export default class ExpenseWidgetController implements _mithril.MithrilController {

    public vm: ExpenseDataSource;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.vm = new ExpenseDataSource(context, day);
    }
}