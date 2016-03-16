/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import modal from "../components/modal";
import * as it from "./intervaltype";
import Rate from "./rate";
import {RateDataSource, RateController} from "./ratecontroller";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import * as ViewHelpers from "../viewhelpers";

export default class RatesComponent implements
    _mithril.MithrilComponent<RateController> {

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
                m("input[type='number'][id='amount'].ui.input", { onchange: ViewHelpers.withNumber("value", rate.amount), value: rate.amount() })
            ]),
            m("div.field", [
                m("label[for='intervaltype']", "Interval Type"),
                m("select[id='intervaltype'].ui.selection.dropdown", { onchange: ViewHelpers.withNumber("value", rate.intervalType), value: rate.intervalType() },
                    ViewHelpers.WriteOptions(rate.intervalType(), RatesComponent.intervalTypeOptions))
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
            m("th[colspan='3']", vm.total())
        ];
    };

    constructor(private context: BudgetContext) {
        this.formComponent = new FormComponent<Rate>(RatesComponent.renderForm);
        this.listComponent = new ListComponent<Rate>(
            RatesComponent.renderHeader,
                    RatesComponent.renderItem,
                    RatesComponent.renderFooter
        );
    }

    public controller = () => {
        let date = m.route.param("date");
        let day = moment(date);
        return new RateController(this.context, day);
    };

    public view = (ctrl: RateController) => {
        return m("div.column", [
                m.component(this.listComponent, ctrl.vm),
                m.component(new modal(ctrl.vm.modalTitle(), ctrl.vm.isAddModalOpen,
                    () => m.component(this.formComponent, { item: ctrl.vm.item }),
                    () => [
                        m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.expire, disabled: ctrl.vm.item().id() <= 0 }, "Expire"),
                        m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.save }, ctrl.vm.modalActionName()),
                        m("button.ui.cancel.button[type='button]", "Cancel")
                    ]))
            ]);
    };
}