/// <reference path="../expense.ts" />

module ExpenseWidget {
    "use strict";
    
    export class ListViewModel {
        
        public expenses: Expense[];
               
        private edit: (index:number) => void;
        private remove: (index:number) => void;
        
        constructor(expenses: Expense[], edit: (index:number) => void, remove: (index:number) => void) {
            this.expenses = expenses;
            this.edit = edit;
            this.remove = remove;
        }
        
        public editExpense = (index: number) => {
            this.edit(index);
        }
        
        public removeExpense = (index: number) => {
            this.remove(index);
        }
    }   
}