/// <reference path="rateformviewmodel.ts" />

module RateWidget {
    "use strict";
    
    export class RateFormController implements _mithril.MithrilController {
        public vm: RateFormViewModel;
        
        constructor(onsave: () => void, rate: _mithril.MithrilProperty<Rate>) {
            this.vm = new RateFormViewModel(onsave, rate);
        }
    }
}