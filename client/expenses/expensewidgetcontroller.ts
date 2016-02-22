namespace ExpenseWidget {
    "use strict";

    class ExpenseDataSource implements Components.DataSource<Expense> {
        item: _mithril.MithrilProperty<Expense>;

        constructor(private context: Data.BudgetContext) {
            this.item = m.prop(new Expense("", <Date>null, 0));
        }

        public list = () => {
            let deferred = m.deferred<Expense[]>();
            deferred.resolve(this.context.listExpenses());
            return deferred.promise;
        };

        public edit = (id: number) => {
            let expense = this.context.getExpense(id);
            if (expense === null) {
                this.item(new Expense("", <Date>null, 0));
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

            this.item(new Expense("", <Date>null, 0));
        };
    }

    export class ExpenseWidgetController implements _mithril.MithrilController {

        public source: ExpenseDataSource;

        constructor(context: Data.BudgetContext) {
            this.source = new ExpenseDataSource(context);
        }
    }
}