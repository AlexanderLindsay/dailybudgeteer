/// <reference path="../../typings/browser.d.ts" />

import * as moment from "moment";
import DataContext from "./datacontext";
import Expense from "../expenses/expense";
import Rate from "../rates/rate";

export default class BudgetContext extends DataContext {

    private static DataKey = "BudgetData";

    private expenses: Expense[];
    private rates: Rate[];
    private nextIds: {
        expenses: number;
        rates: number;
    };

    private updateCallbacks: (() => void)[];

    private setupValues = (fromStorage: boolean = false) => {
        if (fromStorage) {
            let data = localStorage.getItem(BudgetContext.DataKey);
            if (data) {
                this.parseJson(data);
                return;
            }
        }

        this.expenses = [];
        this.rates = [];
        this.nextIds = {
            expenses: 1,
            rates: 1
        };
    };

    constructor() {
        super();
        this.setupValues(true);
        this.updateCallbacks = [];
    }

    public clear = () => {
        this.setupValues();
        this.onUpdate();
    };

    private parseDate(value?: string) {
        if (value === null || value === undefined)
            return undefined;
        return moment(value);
    }

    public addUpdateCallback = (callback: () => void) => {
        this.updateCallbacks.push(callback);
    };

    public removeUpdateCallback = (callback: () => void) => {
        this.updateCallbacks = this.updateCallbacks.filter((cb) => cb === callback);
    };

    private onUpdate = () => {
        localStorage.setItem(BudgetContext.DataKey, this.writeData());
        this.updateCallbacks.forEach(cb => {
            cb();
        });
    };

    private parseJson = (json: string) => {
        let data = JSON.parse(json);
        this.expenses = data.expenses.map((raw: any) => {
            let expense = new Expense(raw.name, this.parseDate(raw.day), raw.amount);
            expense.id(raw.id);
            expense.category(raw.category);

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
    };

    public loadData = (json: string) => {
        this.parseJson(json);
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
        this.onUpdate();
    };

    public addRate = (rate: Rate) => {
        this.nextIds.rates = this.addItem(rate, this.rates, this.nextIds.rates);
        this.onUpdate();
    };

    public getExpense = (id: number) => {
        return this.getItem<Expense>(id, this.expenses);
    };

    public getRate = (id: number) => {
        return this.getItem<Rate>(id, this.rates);
    };

    public removeExpense = (id: number) => {
        this.expenses = this.removeItem(id, this.expenses);
        this.onUpdate();
    };

    public removeRate = (id: number) => {
        this.rates = this.removeItem(id, this.rates);
        this.onUpdate();
    };
}
