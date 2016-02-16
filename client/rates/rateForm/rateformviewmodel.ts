/// <reference path="../rate.ts" />

module RateWidget {
    "use strict";
    
    export class RateFormViewModel {
        public rate: _mithril.MithrilProperty<Rate>;
        
        private save: () => void;
        
        constructor(onsave: () => void, rate : _mithril.MithrilProperty<Rate>) {
            this.rate = rate;
            this.save = onsave;
        }
        
        public saveRate = () => {
            this.save();
        }
    }
}