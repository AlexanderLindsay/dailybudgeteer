/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import Expense from "./expense";
import BudgetContext from "../data/budgetcontext";
import DataSource from "../components/datasource";

const baseExpenseId = -100; // arbitray number that is not zero or -1 (which would be reasonable numbers to assume were sential values for a new record)
const saveTitle = "Add Expense";
const saveActionName = "Add";
const editTitle = "Edit Expense";
const editActionName = "Save";

export class ExpenseDataSource implements DataSource<Expense> {
    item: _mithril.MithrilProperty<Expense>;
    list: _mithril.MithrilPromise<Expense[]>;
    isAddModalOpen: _mithril.MithrilProperty<Boolean>;
    modalTitle: _mithril.MithrilProperty<string>;
    modalActionName: _mithril.MithrilProperty<string>;

    constructor(private context: BudgetContext, private day: moment.Moment) {
        this.item = m.prop(new Expense("", this.day, 0));
        this.isAddModalOpen = m.prop(false);
        this.modalTitle = m.prop(saveTitle);
        this.modalActionName = m.prop(saveActionName);
        this.list = this.fetchList();
        context.addUpdateCallback(this.contextCallback);
    }

    private contextCallback = () => {
        this.list = this.fetchList();
    };

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    };

    private fetchList = () => {
        let perDiem = this.context.listRates().reduce<number>((previous, current, index) => {
            return previous + current.perDiem(this.day);
        }, 0);

        let expenses: Expense[] = this.context.listExpenses().filter((exp) => {
            const expDate = exp.day();
            const day = this.day;
            return expDate.isSame(day, "day");
        });

        if (perDiem !== 0) {
            let baseExpense = new Expense("Base", this.day, perDiem);
            baseExpense.id(baseExpenseId);
            expenses.unshift(baseExpense);
        }

        let deferred = m.deferred<Expense[]>();
        deferred.resolve(expenses);

        return deferred.promise;
    };

    public total = () => {
        let t = 0;
        this.list()
            .forEach((expense: Expense, index: number) => {
                t += expense.amount();
            });
        return t;
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
            current.update(modified);
        }
    };

    public allowEdit = (id: number) => {
        return id !== baseExpenseId;
    };

    public allowRemove = (id: number) => {
        return id !== baseExpenseId;
    };

    public openAddModal = () => {
        this.item(new Expense("", this.day, 0));
        this.modalTitle(saveTitle);
        this.modalActionName(saveActionName);
        this.isAddModalOpen(true);
    };
}

export class ExpenseWidgetController implements _mithril.MithrilController {

    public vm: ExpenseDataSource;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.vm = new ExpenseDataSource(context, day);
    }
}