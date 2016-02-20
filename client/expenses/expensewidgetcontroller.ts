module ExpenseWidget {
    "use strict";

    export class ExpenseWidgetController implements _mithril.MithrilController {

        private nextId: number;
        public expenses: Expense[];
        public expense: _mithril.MithrilProperty<Expense>;

        constructor() {
            this.nextId = 1;
            this.expenses = [];
            this.expense = m.prop(new Expense("", <Date>null, 0));
        }

        public save = () => {
            var exp = this.expense();
            
            if (exp.id() == 0) {
                exp.id(this.nextId)
                this.nextId += 1;
                this.expenses.push(exp);
            }
            
            this.expense(new Expense("", <Date>null, 0))
        }

        public remove = (index: number) => {
            this.expenses.splice(index, 1);
        }

        public edit = (index: number) => {
            if (index < 0 || index > this.expenses.length) {
                this.expense(new Expense("", <Date>null, 0));
            }
            this.expense(this.expenses[index]);
        }
    }
}