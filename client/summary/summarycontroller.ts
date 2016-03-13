/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
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
        let deferred = m.deferred<Expense[]>();
        deferred.resolve(this.context.listExpenses().filter((expense) => {
            const expDate = expense.day();
            const day = this.day;
            return expDate.isBefore(day, "day");
        }));
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