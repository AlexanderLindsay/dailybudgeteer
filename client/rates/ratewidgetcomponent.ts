/// <reference path="ratewidgetcontroller.ts" />
/// <reference path="rateForm/rateformcomponent.ts" />
/// <reference path="list/listcomponent.ts" />

module RateWidget {
    "use strict";
    
    export class RatesWidgetComponent implements
        _mithril.MithrilComponent<RateWidgetController>{

        public controller: () => RateWidgetController;
        public view: _mithril.MithrilView<RateWidgetController>;

        constructor() {
            this.controller = () => { return new RateWidgetController(); };
            this.view = (ctrl) => {
                return [
                    m.component(new ListRatesComponent(ctrl.rates, ctrl.edit, ctrl.remove)),
                    m.component(new RateFormComponent(ctrl.save, ctrl.rate))
                ]   
            };
        }
    }
}