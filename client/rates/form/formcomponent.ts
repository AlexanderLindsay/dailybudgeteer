/// <reference path="formcontroller.ts" />
/// <reference path="formview" />

module RateWidget {
    "use strict";
    
    export class FormComponent implements
        _mithril.MithrilComponent<FormController>{

        public controller: () => FormController;
        public view: _mithril.MithrilView<FormController>;

        constructor(onsave: ()=>void, rate: _mithril.MithrilProperty<Rate>) {
            this.controller = () => { return new FormController(onsave, rate); };
            this.view = formView;
        }
    }
}