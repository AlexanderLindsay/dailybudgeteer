/// <reference path="rate.ts" />
/// <reference path="ratewidgetcontroller.ts" />
/// <reference path="../components/listcomponent.ts" />
/// <reference path="../components/formcomponent.ts" />

module RateWidget {
    "use strict";

    class RateDataSource implements Components.DataSource<Rate> {
        item: _mithril.MithrilProperty<Rate>;
        list: () => _mithril.MithrilPromise<Rate[]>;
        edit: (index: number) => void;
        remove: (index: number) => void;
        save: () => void;

        constructor(
            rate: _mithril.MithrilProperty<Rate>,
            rates: Rate[],
            edit: (index: number) => void,
            remove: (index: number) => void,
            save: () => void) {
            this.item = rate;
            this.list = () => {
                var deferred = m.deferred<Rate[]>();
                deferred.resolve(rates);
                return deferred.promise;
            }
            this.edit = edit;
            this.remove = remove;
            this.save = save;
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

    var renderForm = (rate: Rate) => {
        return [
            m("input[type='text']", { onchange: m.withAttr("value", rate.name), value: rate.name() }),
            m("input[type='number']", { onchange: m.withAttr("value", rate.amount), value: rate.amount() }),
            m("input[type='number']", { onchange: m.withAttr("value", rate.days), value: rate.days() })
        ];
    }

    export class RatesWidgetComponent implements
        _mithril.MithrilComponent<RateWidgetController>{

        public controller: () => RateWidgetController;
        public view: _mithril.MithrilView<RateWidgetController>;

        constructor() {
            this.controller = () => { return new RateWidgetController(); };
            this.view = (ctrl) => {
                var source = new RateDataSource(
                    ctrl.rate,
                    ctrl.rates,
                    ctrl.edit,
                    ctrl.remove,
                    ctrl.save);
                return [
                    m("a[href='/expenses']", { config: m.route }, "Expenses"),
                    m.component(new Components.ListComponent<Rate>(source,
                        renderHeader,
                        renderItem)),
                    m("div", `Daily Rate: ${ctrl.total()}`),
                    m.component(new Components.FormComponent<Rate>(source, renderForm))
                ]
            };
        }
    }
}