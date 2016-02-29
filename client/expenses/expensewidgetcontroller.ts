import moment = require("moment");
import Expense from "./expense";
import BudgetContext from "../data/budgetcontext";
import DataSource from "../components/datasource";

class ExpenseDataSource implements DataSource<Expense> {
    item: _mithril.MithrilProperty<Expense>;

    constructor(private context: BudgetContext, private day: moment.Moment) {
        this.item = m.prop(new Expense("", this.day, 0));
    }

    public list = () => {
        let perDiem = this.context.listRates().reduce<number>((previous, current, index) => {
            return previous + current.perDiem(this.day);
        }, 0);

        let expenses = [];
        if (perDiem !== 0) {
            expenses.push(new Expense("Base", this.day, perDiem));
        }

        expenses.concat(this.context.listExpenses().filter((exp) => {
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
            this.item(expense);
        }
    };

    public remove = (id: number) => {
        this.context.removeExpense(id);
    };

    public save = () => {
        if (this.item().id() === 0) {
            this.context.addExpense(this.item());
        }

        this.item(new Expense("", this.day, 0));
    };
}

export default class ExpenseWidgetController implements _mithril.MithrilController {

    public source: ExpenseDataSource;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.source = new ExpenseDataSource(context, day);
    }
}