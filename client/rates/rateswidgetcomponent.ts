/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import modal from "../components/modal";
import * as it from "./intervaltype";
import Rate from "./rate";
import {RateDataSource, RateWidgetController} from "./ratewidgetcontroller";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import * as ViewHelpers from "../viewhelpers";

export default class RatesWidgetComponent implements
    _mithril.MithrilComponent<RateWidgetController> {

    private formComponent: FormComponent<Rate>;
    private listComponent: ListComponent<Rate>;

    private static renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
            m("th", "Interval"),
            m("th", "Interval Type"),
            m("th", "Amount / Day")
        ];
    };

    private static renderItem = (rate: Rate) => {
        return [
            m("td", rate.name()),
            m("td", rate.amount()),
            m("td", rate.interval()),
            m("td", it.IntervalType[rate.intervalType()]),
            m("td", rate.perDiem(moment()))
        ];
    };

    private static intervalTypeOptions = [
        new ViewHelpers.Option(it.IntervalType.Days, it.IntervalType[it.IntervalType.Days]),
        new ViewHelpers.Option(it.IntervalType.Month, it.IntervalType[it.IntervalType.Month]),
        new ViewHelpers.Option(it.IntervalType.Year, it.IntervalType[it.IntervalType.Year])
    ];

    private static renderForm = (rate: Rate) => {
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
                }, null), value: rate.intervalType() },
                    ViewHelpers.WriteOptions(rate.intervalType(), RatesWidgetComponent.intervalTypeOptions))
            ]),
            m(`div.field${rate.allowInterval() ? "" : ".disabled"}`, [
                m("label[for='interval']", "Interval"),
                m("input[type='number'][id='interval'][min='1'].ui.input",
                    { onchange: m.withAttr("value", rate.interval), value: rate.interval(), disabled: !rate.allowInterval() })
            ]),
        ];
    };

    private static renderFooter = (vm: RateDataSource) => {
        return [
            m("th[colspan='4']", [
                m("button[type='button'].ui.primary.button", { onclick: vm.openAddModal }, "Add Rate")
            ]),
            m("th[colspan='2']", vm.total())
        ];
    };

    constructor(private context: BudgetContext) {
        this.formComponent = new FormComponent<Rate>(RatesWidgetComponent.renderForm);
        this.listComponent = new ListComponent<Rate>(
            RatesWidgetComponent.renderHeader,
                    RatesWidgetComponent.renderItem,
                    RatesWidgetComponent.renderFooter
        );
    }

    public controller = () => {
        return new RateWidgetController(this.context);
    };

    public view = (ctrl: RateWidgetController) => {
        return m("div.column", [
                m.component(this.listComponent, ctrl.vm),
                m.component(new modal(ctrl.vm.modalTitle(), ctrl.vm.isAddModalOpen,
                    () => m.component(this.formComponent, { item: ctrl.vm.item }),
                    () => [
                        m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.save }, ctrl.vm.modalActionName()),
                        m("button.ui.cancel.button[type='button]", "Cancel")
                    ]))
            ]);
    };
}