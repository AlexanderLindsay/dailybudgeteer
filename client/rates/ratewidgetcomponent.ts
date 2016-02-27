/// <reference path="rate.ts" />
/// <reference path="ratewidgetcontroller.ts" />
/// <reference path="../components/listcomponent.ts" />
/// <reference path="../components/formcomponent.ts" />
/// <reference path="../viewhelpers.ts" />

namespace RateWidget {
    "use strict";

    let renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
            m("th", "Interval"),
            m("th", "Interval Type"),
            m("th", "Amount / Day")
        ];
    };

    let renderItem = (rate: Rate) => {
        return [
            m("td", rate.name()),
            m("td", rate.amount()),
            m("td", rate.interval()),
            m("td", IntervalType[rate.intervalType()]),
            m("td", rate.perDiem(new Date()))
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
                m("label[for='intervaltype']", "Interval Type"),
                m("select[id='intervaltype'].ui.selection.dropdown", { onchange: m.withAttr("value", (value) => {
                    rate.intervalType(+value);
                }, null) },
                    ViewHelpers.WriteOptions(rate.intervalType(), [
                        new ViewHelpers.Option(IntervalType.Days, IntervalType[IntervalType.Days]),
                        new ViewHelpers.Option(IntervalType.Month, IntervalType[IntervalType.Month]),
                        new ViewHelpers.Option(IntervalType.Year, IntervalType[IntervalType.Year])
                    ]))
            ]),
            m(`div.field${rate.allowInterval() ? "" : ".disabled"}`, [
                m("label[for='interval']", "Interval"),
                m(`input[type='number'][id='interval'][min='1']${rate.allowInterval() ? "" : "[disabled]"}.ui.input`,
                    { onchange: m.withAttr("value", rate.interval), value: rate.interval() })
            ]),
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
                    m.component(new Components.FormComponent<Rate>(ctrl.source, renderForm))
                ]);
            };
        }
    }
}