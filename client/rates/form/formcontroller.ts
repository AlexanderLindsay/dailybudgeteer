/// <reference path="formviewmodel.ts" />

module RateWidget {
    "use strict";
    
    export class FormController implements _mithril.MithrilController {
        public vm: FormViewModel;
        
        constructor(onsave: () => void, rate: _mithril.MithrilProperty<Rate>) {
            this.vm = new FormViewModel(onsave, rate);
        }
    }
}