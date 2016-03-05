import moment = require("moment");
import modal from "../components/modal";
import * as it from "./intervaltype";
import Rate from "./rate";
import RateWidgetController from "./ratewidgetcontroller";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import * as ViewHelpers from "../viewhelpers";

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
        m("td", it.IntervalType[rate.intervalType()]),
        m("td", rate.perDiem(moment()))
    ];
};

let intervalTypeOptions = [
    new ViewHelpers.Option(it.IntervalType.Days, it.IntervalType[it.IntervalType.Days]),
    new ViewHelpers.Option(it.IntervalType.Month, it.IntervalType[it.IntervalType.Month]),
    new ViewHelpers.Option(it.IntervalType.Year, it.IntervalType[it.IntervalType.Year])
];

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
                ViewHelpers.WriteOptions(rate.intervalType(), intervalTypeOptions))
        ]),
        m(`div.field${rate.allowInterval() ? "" : ".disabled"}`, [
            m("label[for='interval']", "Interval"),
            m(`input[type='number'][id='interval'][min='1']${rate.allowInterval() ? "" : "[disabled]"}.ui.input`,
                { onchange: m.withAttr("value", rate.interval), value: rate.interval() })
        ]),
    ];
};

let renderFooter = (ctrl: RateWidgetController) => {
    return [
        m("th[colspan='4']", [
            m("button[type='button'].ui.primary.button", { onclick: ctrl.vm.openAddModal }, "Add Rate")
        ]),
        m("th[colspan='2']", ctrl.vm.total())
    ];
};

export default class RatesWidgetComponent implements
    _mithril.MithrilComponent<RateWidgetController> {

    public controller: () => RateWidgetController;
    public view: _mithril.MithrilView<RateWidgetController>;

    constructor(context: BudgetContext) {
        this.controller = () => { return new RateWidgetController(context); };
        this.view = (ctrl) => {
            return m("div.column", [
                m.component(new ListComponent<Rate>(ctrl.vm,
                    renderHeader,
                    renderItem,
                    renderFooter.bind(this, ctrl))),
                m.component(new modal(ctrl.vm.modalTitle(), ctrl.vm.isAddModalOpen,
                    () => new FormComponent<Rate>(ctrl.vm, renderForm),
                    () => [
                        m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.save }, ctrl.vm.modalActionName()),
                        m("button.ui.cancel.button[type='button]", "Cancel")
                    ]))
            ]);
        };
    }
}