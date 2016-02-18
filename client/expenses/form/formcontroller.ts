/// <reference path="formviewmodel.ts" />

module ExpenseWidget {
    "use strict";
    
    export class FormController implements _mithril.MithrilController {
        public vm: FormViewModel;
        
        constructor(onsave: () => void, expense: _mithril.MithrilProperty<Expense>) {
            this.vm = new FormViewModel(onsave, expense);
        }
    }
}