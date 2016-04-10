/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import modal from "../components/modal";
import * as it from "./intervaltype";
import Rate from "./rate";
import {RateDataSource, RateController} from "./ratecontroller";
import ChangeDateComponent from "../components/changedatecomponent";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import * as ViewHelpers from "../utils/viewhelpers";
import formatCurrency from "../utils/currencyFormatter";
import * as DF from "../utils/dateFormatter";

export default class RatesComponent implements
    _mithril.MithrilComponent<RateController> {

    private changeDateComponent: ChangeDateComponent;
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
            m("td", formatCurrency(rate.amount())),
            m("td", rate.interval()),
            m("td", it.IntervalType[rate.intervalType()]),
            m("td", formatCurrency(rate.perDiem(moment())))
        ];
    };

    private static intervalTypeOptions = [
        new ViewHelpers.Option(it.IntervalType.Days, it.IntervalType[it.IntervalType.Days]),
        new ViewHelpers.Option(it.IntervalType.Month, it.IntervalType[it.IntervalType.Month]),
        new ViewHelpers.Option(it.IntervalType.Year, it.IntervalType[it.IntervalType.Year])
    ];

    private static renderForm = (args: { item: Rate, editDuration: boolean }) => {
        let rate = args.item;

        let fields = [
            m("div.field", [
                m("label[for='name']", "Name"),
                m("input[type='text'][id='name'][placeholder='Name'].ui.input", { onchange: m.withAttr("value", rate.name), value: rate.name() })
            ]),
            m("div.field", [
                m("label[for='amount']", "Amount"),
                m("input[type='number'][id='amount'].ui.input", { onchange: ViewHelpers.withNumber("value", rate.amount), value: rate.amount() })
            ]),
            m("div.two.fields", [
                m("div.field", [
                    m("label[for='intervaltype']", "Interval Type"),
                    m("select[id='intervaltype'].ui.selection.dropdown", { config: ViewHelpers.createDropdown(), onchange: ViewHelpers.withNumber("value", rate.intervalType), value: rate.intervalType() },
                        ViewHelpers.writeOptions(rate.intervalType(), RatesComponent.intervalTypeOptions))
                ]),
                m(`div.field${rate.allowInterval() ? "" : ".disabled"}`, [
                    m("label[for='interval']", "Interval"),
                    m("input[type='number'][id='interval'][min='1'].ui.input",
                        { onchange: m.withAttr("value", rate.interval), value: rate.interval(), disabled: !rate.allowInterval() })
                ])
            ])
        ];

        if (args.editDuration) {
            fields.push(
                m("div.two.fields", [
                    m("div.field", [
                        m("label[for='startdate']", "Start Date"),
                        m("input[type='date'][id='startdate'].ui.input", { onchange: m.withAttr("value", DF.setDate.bind(null, rate.startDate), null), value: DF.getDate(rate.startDate) })
                    ]),
                    m("div.field", [
                        m("label[for='enddate']", "End Date"),
                        m("input[type='date'][id='enddate'].ui.input", { onchange: m.withAttr("value", DF.setDate.bind(null, rate.endDate), null), value: DF.getDate(rate.endDate) })
                    ])
                ]));
        }

        return fields;
    };

    private static renderFooter = (vm: RateDataSource) => {
        return [
            m("th[colspan='4']", [
                m("button[type='button'].ui.primary.button", { onclick: vm.openAddModal }, "Add Rate")
            ]),
            m("th[colspan='3']", formatCurrency(vm.total()))
        ];
    };

    constructor(private context: BudgetContext) {
        this.changeDateComponent = new ChangeDateComponent("/rates");
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
            m.component(this.changeDateComponent, ctrl.vm.day.clone()),
            m.component(this.listComponent, ctrl.vm),
            m.component(new modal(ctrl.vm.modalTitle(), ctrl.vm.isAddModalOpen,
                () => m.component(this.formComponent, { item: ctrl.vm.item(), editDuration: ctrl.vm.editDates() }),
                () => [
                    m("button.ui.left.floated.button[type='button']", { onclick: ctrl.vm.editDuration, disabled: ctrl.vm.item().id() <= 0 || ctrl.vm.editDates() }, "Edit Duration"),
                    m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.expire, disabled: ctrl.vm.item().id() <= 0 }, "Expire"),
                    m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.save }, ctrl.vm.modalActionName()),
                    m("button.ui.cancel.button[type='button]", "Cancel")
                ]))
        ]);
    };
}