/// <reference path="../../typings/browser.d.ts" />

import * as moment from "moment";
import DataContext from "./datacontext";
import Expense from "../expenses/expense";
import Rate from "../rates/rate";
import Category from "../categories/category";

export default class BudgetContext extends DataContext {

    private static DataKey = "BudgetData";

    private expenses: Expense[];
    private rates: Rate[];
    private categories: Category[];
    private nextIds: {
        expenses: number;
        rates: number;
        categories: number;
    };

    private updateCallbacks: (() => void)[];

    private setupValues = () => {
        this.expenses = [];
        this.rates = [];
        this.categories = [];
        this.nextIds = {
            expenses: 1,
            rates: 1,
            categories: 1
        };
    };

    constructor(existingData?: string) {
        super();
        if (existingData === undefined || existingData === null) {
            this.setupValues();
        } else {
            this.parseJson(existingData);
        }
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
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(BudgetContext.DataKey, this.writeData());
        }

        this.updateCallbacks.forEach(cb => {
            cb();
        });
    };

    private parseJson = (json: string) => {
        let data = JSON.parse(json);
        this.expenses = (data.expenses || []).map((raw: any) => {
            let expense = new Expense(raw.name, this.parseDate(raw.day), raw.amount);
            expense.id(raw.id);
            expense.category(raw.category);

            return expense;
        });
        this.rates = (data.rates || []).map((raw: any) => {
            let rate = new Rate(
                raw.name,
                raw.amount,
                raw.interval,
                raw.intervalType,
                this.parseDate(raw.startDate),
                this.parseDate(raw.endDate));
            rate.id(raw.id);
            return rate;
        });
        this.categories = (data.categories || []).map((raw: any) => {
            let category = new Category();
            category.id(raw.id);
            category.name(raw.name);
            category.description(raw.description);
            return category;
        });

        let storedIds = data.nextIds || {
            expenses: 1,
            rates: 1,
            categories: 1
        };

        this.nextIds = {
            expenses: storedIds.expenses || 1,
            rates: storedIds.rates || 1,
            categories: storedIds.categories || 1
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
            categories: this.categories,
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

    public listCategories = () => {
        return this.categories.slice(0);
    };

    public addExpense = (expense: Expense) => {
        this.nextIds.expenses = this.addItem(expense, this.expenses, this.nextIds.expenses);
        this.onUpdate();
    };

    public addRate = (rate: Rate) => {
        this.nextIds.rates = this.addItem(rate, this.rates, this.nextIds.rates);
        this.onUpdate();
    };

    public addCategory = (category: Category) => {
        this.nextIds.categories = this.addItem(category, this.categories, this.nextIds.categories);
        this.onUpdate();
    };

    public getExpense = (id: number) => {
        return this.getItem<Expense>(id, this.expenses);
    };

    public getRate = (id: number) => {
        return this.getItem<Rate>(id, this.rates);
    };

    public getCategory = (id: number) => {
        return this.getItem<Category>(id, this.categories);
    };

    public removeExpense = (id: number) => {
        this.expenses = this.removeItem(id, this.expenses);
        this.onUpdate();
    };

    public removeRate = (id: number) => {
        this.rates = this.removeItem(id, this.rates);
        this.onUpdate();
    };

    public removeCategory = (id: number) => {
        this.categories = this.removeItem(id, this.categories);
        this.onUpdate();
    };
}
