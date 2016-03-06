/// <reference path="../../typings/browser.d.ts" />

import * as moment from "moment";
import DataContext from "./datacontext";
import Expense from "../expenses/expense";
import Rate from "../rates/rate";

export default class BudgetContext extends DataContext {

    private expenses: Expense[];
    private rates: Rate[];
    private nextIds: {
        expenses: number;
        rates: number;
    };

    private updateCallbacks: (() => void)[];

    constructor() {
        super();
        this.expenses = [];
        this.rates = [];
        this.nextIds = {
            expenses: 1,
            rates: 1
        };

        this.updateCallbacks = [];
    }

    private parseDate(value: string) {
        return moment(value);
    }

    public addUpdateCallback = (callback: () => void) => {
        this.updateCallbacks.push(callback);
    };

    public removeUpdateCallback = (callback: () => void) => {
        this.updateCallbacks = this.updateCallbacks.filter((cb) => cb === callback);
    };

    private onUpdate = () => {
        this.updateCallbacks.forEach(cb => {
            cb();
        });
    };

    public loadData = (json: string) => {
        let data = JSON.parse(json);
        this.expenses = data.expenses.map((raw: any) => {
            let expense = new Expense(raw.name, this.parseDate(raw.day), raw.amount);
            expense.id(raw.id);
            return expense;
        }) || [];
        this.rates = data.rates.map((raw: any) => {
            let rate = new Rate(
                raw.name,
                raw.amount,
                raw.interval,
                raw.intervalType,
                this.parseDate(raw.startDate),
                this.parseDate(raw.endDate));
            rate.id(raw.id);
            return rate;
        }) || [];
        this.nextIds = data.nextIds || {
            expenses: 1,
            rates: 1
        };
        this.onUpdate();
    };

    public writeData = () => {
        let data = {
            expenses: this.expenses,
            rates: this.rates,
            nextIds: this.nextIds
        };

        return JSON.stringify(data);
    };

    public listExpenses = () => {
        return this.expenses.slice(0);
    };

    public listRates = () => {
        return this.rates.slice(0);
    };

    public addExpense = (expense: Expense) => {
        this.nextIds.expenses = this.addItem(expense, this.expenses, this.nextIds.expenses);
    };

    public addRate = (rate: Rate) => {
        this.nextIds.rates = this.addItem(rate, this.rates, this.nextIds.rates);
    };

    public getExpense = (id: number) => {
        return this.getItem<Expense>(id, this.expenses);
    };

    public getRate = (id: number) => {
        return this.getItem<Rate>(id, this.rates);
    };

    public removeExpense = (id: number) => {
        this.expenses = this.removeItem(id, this.expenses);
    };

    public removeRate = (id: number) => {
        this.rates = this.removeItem(id, this.rates);
    };
}
