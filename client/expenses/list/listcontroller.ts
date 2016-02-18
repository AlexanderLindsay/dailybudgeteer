/// <reference path="listviewmodel.ts" />

module ExpenseWidget {
    "use strict";
    
    export class ListController implements _mithril.MithrilController {
        public vm: ListViewModel;

        constructor(list: Expense[], edit: (index:number) => void, remove: (index:number) => void) {
            this.vm = new ListViewModel(list, edit, remove);
        }
    }
}