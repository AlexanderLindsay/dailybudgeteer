import * as m from "mithril";
import * as moment from "moment";
import {ModalComponent, ModalController} from "../components/modal";
import * as it from "./intervaltype";
import Rate from "./rate";
import RateController from "./ratecontroller";
import {ChangeDateComponent, ChangeDateController} from "../components/changedatecomponent";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import * as ViewHelpers from "../utils/viewhelpers";
import formatCurrency from "../utils/currencyFormatter";
import * as DF from "../utils/dateFormatter";

export default class RatesComponent implements
    m.ClassComponent<RateController> {

    private formComponent: FormComponent;
    private listComponent: ListComponent<Rate>;

    private static renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Amount"),
            m("th", "Interval"),
            m("th", "Interval Type"),
            m("th", "Amount / Day")
        ];
    }

    private static renderItem = (rate: Rate) => {
        return [
            m("td", rate.name()),
            m("td", formatCurrency(rate.amount())),
            m("td", rate.interval()),
            m("td", it.IntervalType[rate.intervalType()]),
            m("td", formatCurrency(rate.perDiem(moment())))
        ];
    }

    private static intervalTypeOptions = [
        new ViewHelpers.Option(it.IntervalType.Days, it.IntervalType[it.IntervalType.Days]),
        new ViewHelpers.Option(it.IntervalType.Month, it.IntervalType[it.IntervalType.Month]),
        new ViewHelpers.Option(it.IntervalType.Year, it.IntervalType[it.IntervalType.Year])
    ];

    private static renderForm = (rate: Rate, editDuration: boolean) => {
        let fields = [
            m("div.field", [
                m("label[for='name']", "Name"),
                m("input[type='text'][id='name'][placeholder='Name'].ui.input", {
                    onchange: m.withAttr("value", rate.name),
                    value: rate.name()
                })
            ]),
            m("div.field", [
                m("label[for='amount']", "Amount"),
                m("input[type='number'][id='amount'].ui.input", {
                    onchange: ViewHelpers.withNumber("value", rate.amount),
                    value: rate.amount()
                })
            ]),
            m("div.two.fields", [
                m("div.field", [
                    m("label[for='intervaltype']", "Interval Type"),
                    m("select", {
                        onchange: ViewHelpers.withNumber("value", rate.intervalType)
                    },
                    ViewHelpers.writeOptions(rate.intervalType(), RatesComponent.intervalTypeOptions)
                    )
                ]),
                m(`div.field${rate.allowInterval() ? "" : ".disabled"}`, [
                    m("label[for='interval']", "Interval"),
                    m("input[type='number'][id='interval'][min='1'].ui.input",
                        {
                            onchange: m.withAttr("value", rate.interval),
                            value: rate.interval(), disabled: !rate.allowInterval()
                        })
                ])
            ])
        ];

        if (editDuration) {
            fields.push(
                m("div.two.fields", [
                    m("div.field", [
                        m("label[for='startdate']", "Start Date"),
                        m("input[type='date'][id='startdate'].ui.input", {
                            onchange: m.withAttr("value", DF.setDate.bind(null, rate.startDate), null),
                            value: DF.getDate(rate.startDate)
                        })
                    ]),
                    m("div.field", [
                        m("label[for='enddate']", "End Date"),
                        m("input[type='date'][id='enddate'].ui.input", {
                            onchange: m.withAttr("value", DF.setDate.bind(null, rate.endDate), null),
                            value: DF.getDate(rate.endDate)
                        })
                    ])
                ]));
        }

        return fields;
    }

    private static renderFooter = (vm: RateController) => {
        return [
            m("th[colspan='4']", [
                m("button[type='button'].ui.primary.button", { onclick: vm.openAddModal }, "Add Rate")
            ]),
            m("th[colspan='3']", formatCurrency(vm.total()))
        ];
    }

    constructor(private context: BudgetContext) {
        this.formComponent = new FormComponent();
        this.listComponent = new ListComponent<Rate>(
            RatesComponent.renderHeader,
            RatesComponent.renderItem,
            RatesComponent.renderFooter
        );
    }

    public oninit = ({attrs}: m.CVnode<RateController>) => {
        let date = m.route.param("date");
        let day = moment(date);
        attrs.day(day);
    }

    public view = ({attrs}: m.CVnode<RateController>) => {
        let ctrl = attrs;
        return m("div.column", [
            m(new ChangeDateComponent(), new ChangeDateController("/rates", ctrl.day().clone())),
            m(this.listComponent, ctrl),
            m(new ModalComponent(), new ModalController(
                ctrl.isAddModalOpen,
                ctrl.modalTitle(),
                false,
                () => [this.formComponent.renderForm(
                    RatesComponent.renderForm(ctrl.item(), ctrl.editDates()))],
                () => [
                    m("button.ui.left.floated.button[type='button']", {
                        onclick: ctrl.editDuration,
                        disabled: ctrl.item().id() <= 0 || ctrl.editDates()
                    }, "Edit Duration"),
                    m("button.ui.approve.button[type='button']", { onclick: ctrl.expire, disabled: ctrl.item().id() <= 0 }, "Expire"),
                    m("button.ui.approve.button[type='button']", { onclick: ctrl.save }, ctrl.modalActionName()),
                    m("button.ui.cancel.button[type='button]", "Cancel")
                ]))
        ]);
    }
}