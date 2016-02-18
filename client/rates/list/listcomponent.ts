/// <reference path="listcontroller.ts" />
/// <reference path="listview.ts" />

module RateWidget {
    "use strict";
    
    export class ListComponent implements
        _mithril.MithrilComponent<ListController>{

        public controller: () => ListController;
        public view: _mithril.MithrilView<ListController>;

        constructor(list: Rate[], edit: (index:number) => void, remove: (index:number) => void) {
            this.controller = () => { return new ListController(list, edit, remove); };
            this.view = listView;
        }
    }
}