/// <reference path="listcontroller.ts" />
/// <reference path="listview.ts" />

module ExpenseWidget {
    "use strict";
    
    export class ListComponent implements
        _mithril.MithrilComponent<ListController>{

        public controller: () => ListController;
        public view: _mithril.MithrilView<ListController>;

        constructor(list: Expense[], edit: (index:number) => void, remove: (index:number) => void) {
            this.controller = () => { return new ListController(list, edit, remove); };
            this.view = listView;
        }
    }
}