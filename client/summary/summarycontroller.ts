/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
let momentrange = require("moment-range");
import BudgetContext from "../data/budgetcontext";
import Expense from "../expenses/expense";
import Rate from "../rates/rate";

export class SummaryViewModel {

    expenses: _mithril.MithrilPromise<Expense[]>;
    rates: _mithril.MithrilPromise<Rate[]>;

    constructor(private context: BudgetContext, private day: moment.Moment) {
        this.expenses = this.fetchExpenses();
        this.rates = this.fetchRates();
        context.addUpdateCallback(this.contextCallback);
    }

    private contextCallback = () => {
        this.expenses = this.fetchExpenses();
        this.rates = this.fetchRates();
    };

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    };

    private fetchExpenses = () => {
        let perDiem = (d: moment.Moment) => {
            return this.context.listRates().reduce<number>((previous, current, index) => {
                return previous + current.perDiem(this.day);
            }, 0);
        };

        let expenses: Expense[] = this.context.listExpenses();

        let start = this.day.clone().startOf("month").subtract(2, "month");
        let end = this.day.clone();
        let range = moment.range(start, end);
        let results: Expense[] = [];
        range.by("day", d => {
            let exp = new Expense(d.format(), d, perDiem(d));
            expenses
            .filter(e => {
                return e.day().isSame(d, "day");
            })
            .reduce<Expense>((accum, current, index) => {
                accum.amount(accum.amount() + current.amount());
                return accum;
            }, exp);
            results.push(exp);
        });

        let deferred = m.deferred<Expense[]>();
        deferred.resolve(results);
        return deferred.promise;
    };

    private fetchRates = () => {
        let deferred = m.deferred<Rate[]>();
        deferred.resolve(this.context.listRates().filter(rate => {
            if (rate.startDate() == null) {
                return true;
            } else if (rate.startDate().isSameOrBefore(this.day, "day")) {
                return true;
            }
            return false;
        }));
        return deferred.promise;
    };
}

export class SummaryController implements _mithril.MithrilController {

    public vm: SummaryViewModel;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.vm = new SummaryViewModel(context, day);
    }
}