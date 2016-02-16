/// <reference path="listcontroller.ts" />
/// <reference path="listview.ts" />

module RateWidget {
    "use strict";
    
    export class ListRatesComponent implements
        _mithril.MithrilComponent<ListRatesController>{

        public controller: () => ListRatesController;
        public view: _mithril.MithrilView<ListRatesController>;

        constructor(list: Rate[], edit: (index:number) => void, remove: (index:number) => void) {
            this.controller = () => { return new ListRatesController(list, edit, remove); };
            this.view = listView;
        }
    }
}