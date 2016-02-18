/// <reference path="ratewidgetcontroller.ts" />
/// <reference path="form/formcomponent.ts" />
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
                    m.component(new ListComponent(ctrl.rates, ctrl.edit, ctrl.remove)),
                    m.component(new FormComponent(ctrl.save, ctrl.rate))
                ]   
            };
        }
    }
}