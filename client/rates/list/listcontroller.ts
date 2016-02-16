/// <reference path="listviewmodel.ts" />

module RateWidget {
    "use strict";
    
    export class ListRatesController implements _mithril.MithrilController {
        public vm: ListRates;

        constructor(list: Rate[], edit: (index:number) => void, remove: (index:number) => void) {
            this.vm = new ListRates(list, edit, remove);
        }
    }
}