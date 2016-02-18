/// <reference path="listviewmodel.ts" />

module RateWidget {
    "use strict";
    
    export class ListController implements _mithril.MithrilController {
        public vm: ListViewModel;

        constructor(list: Rate[], edit: (index:number) => void, remove: (index:number) => void) {
            this.vm = new ListViewModel(list, edit, remove);
        }
    }
}