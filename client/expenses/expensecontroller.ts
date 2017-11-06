import * as m from "mithril";
import * as prop from "mithril/stream";
import * as moment from "moment";
import Expense from "./expense";
import BudgetContext from "../data/budgetcontext";
import DataSource from "../components/datasource";

// arbitrary number that is not zero or -1 (which would be reasonable numbers to assume were sentinel values for a new record)
const baseExpenseId = -100;

const saveTitle = "Add Expense";
const saveActionName = "Add";
const editTitle = "Edit Expense";
const editActionName = "Save";

export default class ExpenseController implements DataSource<Expense> {
    item: prop.Stream<Expense>;
    list: prop.Stream<Expense[]>;
    isAddModalOpen: prop.Stream<boolean>;
    modalTitle: prop.Stream<string>;
    modalActionName: prop.Stream<string>;

    public day: prop.Stream<moment.Moment>;

    constructor(private context: BudgetContext) {
        this.day = prop(moment());
        this.item = prop(new Expense("", this.day().clone(), 0));
        this.isAddModalOpen = prop(false);
        this.modalTitle = prop(saveTitle);
        this.modalActionName = prop(saveActionName);
        this.list = prop([]);
        context.addUpdateCallback(this.contextCallback);

        this.fetchList();
    }

    public updateDate = (date: moment.Moment) => {
        this.day(date);
        this.fetchList();
    }

    private contextCallback = () => {
        this.fetchList();
    }

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    }

    private fetchList = () => {
        let perDiem = this.context.listActiveRates(this.day()).reduce<number>((previous, current, index) => {
            return previous + current.perDiem(this.day());
        }, 0);

        let expenses: Expense[] = this.context.listExpenses().filter((exp) => {
            const expDate = exp.day();
            const day = this.day;
            return expDate.isSame(day(), "day");
        });

        if (perDiem !== 0) {
            let baseExpense = new Expense("Base", this.day(), perDiem);
            baseExpense.id(baseExpenseId);
            expenses.unshift(baseExpense);
        }

        this.list(expenses);
    }

    public total = () => {
        let t = 0;
        this.list()
            .forEach((expense: Expense, index: number) => {
                t += expense.amount();
            });
        return t;
    }

    public edit = (id: number) => {
        let expense = this.context.getExpense(id);
        if (expense === null) {
            this.item(new Expense("", this.day(), 0));
        } else {
            this.item(expense.clone());
        }

        this.modalTitle(editTitle);
        this.modalActionName(editActionName);
        this.isAddModalOpen(true);
    }

    public remove = (id: number) => {
        this.context.removeExpense(id);
    }

    public save = () => {
        if (this.item().id() === 0) {
            this.context.addExpense(this.item());
        } else {
            let modified = this.item();
            let current = this.context.getExpense(modified.id());
            current.update(modified);
        }
        this.isAddModalOpen(false);
    }

    public allowEdit = (id: number) => {
        return id !== baseExpenseId;
    }

    public allowRemove = (id: number) => {
        return id !== baseExpenseId;
    }

    public openAddModal = () => {
        this.item(new Expense("", this.day(), 0));
        this.modalTitle(saveTitle);
        this.modalActionName(saveActionName);
        this.isAddModalOpen(true);
    }
}