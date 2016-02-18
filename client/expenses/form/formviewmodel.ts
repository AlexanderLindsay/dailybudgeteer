/// <reference path="../expense.ts" />

module ExpenseWidget {
    "use strict";
    
    export class FormViewModel {
        public expense: _mithril.MithrilProperty<Expense>;
        
        private save: () => void;
        
        constructor(onsave: () => void, expense : _mithril.MithrilProperty<Expense>) {
            this.expense = expense;
            this.save = onsave;
        }
        
        public saveExpense = () => {
            this.save();
        }
    }
}