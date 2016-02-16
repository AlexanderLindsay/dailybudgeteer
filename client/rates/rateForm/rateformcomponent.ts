/// <reference path="rateformcontroller.ts" />
/// <reference path="rateformview" />

module RateWidget {
    "use strict";
    
    export class RateFormComponent implements
        _mithril.MithrilComponent<RateFormController>{

        public controller: () => RateFormController;
        public view: _mithril.MithrilView<RateFormController>;

        constructor(onsave: ()=>void, rate: _mithril.MithrilProperty<Rate>) {
            this.controller = () => { return new RateFormController(onsave, rate); };
            this.view = rateFormView;
        }
    }
}