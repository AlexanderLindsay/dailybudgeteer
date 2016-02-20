/// <reference path="ratewidgetcontroller.ts" />
/// <reference path="form/formcomponent.ts" />
/// <reference path="../components/listcomponent.ts" />

module RateWidget {
    "use strict";

    class RateDataSource implements Components.DataSource<Rate> {
        list: () => _mithril.MithrilPromise<Rate[]>;
        edit: (index: number) => void;
        remove: (index: number) => void;

        constructor(rates: Rate[], edit: (index: number) => void, remove: (index: number) => void) {
            this.list = () => {
                var deferred = m.deferred<Rate[]>();
                deferred.resolve(rates);
                return deferred.promise;
            }
            this.edit = edit;
            this.remove = remove;
        }
    }

    var renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
            m("th", "Days"),
            m("th", "Amount / Day")
        ];
    }

    var renderItem = (rate: Rate) => {
        return [
            m("td", rate.name()),
            m("td", rate.amount()),
            m("td", rate.days()),
            m("td", rate.perDiem())
        ];
    }

    export class RatesWidgetComponent implements
        _mithril.MithrilComponent<RateWidgetController>{

        public controller: () => RateWidgetController;
        public view: _mithril.MithrilView<RateWidgetController>;

        constructor() {
            this.controller = () => { return new RateWidgetController(); };
            this.view = (ctrl) => {
                return [
                    m("a[href='/expenses']", { config: m.route }, "Expenses"),
                    m.component(new Components.ListComponent<Rate>(
                        new RateDataSource(ctrl.rates, ctrl.edit, ctrl.remove),
                        renderHeader,
                        renderItem)),
                    m("div", `Daily Rate: ${ctrl.total()}`),
                    m.component(new FormComponent(ctrl.save, ctrl.rate))
                ]
            };
        }
    }
}