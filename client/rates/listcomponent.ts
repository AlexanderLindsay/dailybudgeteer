/// <reference path="listcontroller.ts" />
/// <reference path="listview.ts" />


module Rates {
    "use strict";
    
    export class ListRatesComponent implements
        _mithril.MithrilComponent<ListRatesController>{

        public controller: () => ListRatesController;
        public view: _mithril.MithrilView<ListRatesController>;

        constructor() {
            this.controller = () => { return new ListRatesController(); };
            this.view = listView;
        }
    }
}