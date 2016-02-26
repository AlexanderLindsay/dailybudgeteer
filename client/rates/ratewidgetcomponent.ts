/// <reference path="rate.ts" />
/// <reference path="ratewidgetcontroller.ts" />
/// <reference path="../components/listcomponent.ts" />
/// <reference path="../components/formcomponent.ts" />

namespace RateWidget {
    "use strict";

    let renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
            m("th", "Days"),
            m("th", "Amount / Day")
        ];
    };

    let renderItem = (rate: Rate) => {
        return [
            m("td", rate.name()),
            m("td", rate.amount()),
            m("td", rate.days()),
            m("td", rate.perDiem())
        ];
    };

    let renderForm = (rate: Rate) => {
        return [
            m("div.field", [
                m("label[for='name']", "Name"),
                m("input[type='text'][id='name'][placeholder='Name'].ui.input", { onchange: m.withAttr("value", rate.name), value: rate.name() })
            ]),
            m("div.field", [
                m("label[for='amount']", "Amount"),
                m("input[type='number'][id='amount'].ui.input", { onchange: m.withAttr("value", rate.amount), value: rate.amount() })
            ]),
            m("div.field", [
                m("label[for='days']", "Days"),
                m("input[type='number'][id='days'].ui.input", { onchange: m.withAttr("value", rate.days), value: rate.days() })
            ])
        ];
    };

    export class RatesWidgetComponent implements
        _mithril.MithrilComponent<RateWidgetController> {

        public controller: () => RateWidgetController;
        public view: _mithril.MithrilView<RateWidgetController>;

        constructor(context: Data.BudgetContext) {
            this.controller = () => { return new RateWidgetController(context); };
            this.view = (ctrl) => {
                return m("div.column", [
                    m.component(new Components.ListComponent<Rate>(ctrl.source,
                        renderHeader,
                        renderItem)),
                    m("div", `Daily Rate: ${ctrl.source.total()}`),
                    m.component(new Components.FormComponent<Rate>(ctrl.source, renderForm))
                ]);
            };
        }
    }
}