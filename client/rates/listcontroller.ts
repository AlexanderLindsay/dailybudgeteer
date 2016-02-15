/// <reference path="listviewmodel.ts" />

module Rates {
    "use strict";
    
    export class ListRatesController implements _mithril.MithrilController {
        public vm: ListRates;

        constructor() {
            this.vm = new ListRates();
        }
    }
}