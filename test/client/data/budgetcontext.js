/// <reference path="../../typings/browser.d.ts" />
"use strict";
const moment = require("moment");
const datacontext_1 = require("./datacontext");
const expense_1 = require("../expenses/expense");
const rate_1 = require("../rates/rate");
class BudgetContext extends datacontext_1.default {
    constructor() {
        super();
        this.addUpdateCallback = (callback) => {
            this.updateCallbacks.push(callback);
        };
        this.removeUpdateCallback = (callback) => {
            this.updateCallbacks = this.updateCallbacks.filter((cb) => cb === callback);
        };
        this.onUpdate = () => {
            this.updateCallbacks.forEach(cb => {
                cb();
            });
        };
        this.loadData = (json) => {
            let data = JSON.parse(json);
            this.expenses = data.expenses.map((raw) => {
                let expense = new expense_1.default(raw.name, this.parseDate(raw.day), raw.amount);
                expense.id(raw.id);
                return expense;
            }) || [];
            this.rates = data.rates.map((raw) => {
                let rate = new rate_1.default(raw.name, raw.amount, raw.interval, raw.intervalType, this.parseDate(raw.startDate), this.parseDate(raw.endDate));
                rate.id(raw.id);
                return rate;
            }) || [];
            this.nextIds = data.nextIds || {
                expenses: 1,
                rates: 1
            };
            this.onUpdate();
        };
        this.writeData = () => {
            let data = {
                expenses: this.expenses,
                rates: this.rates,
                nextIds: this.nextIds
            };
            return JSON.stringify(data);
        };
        this.listExpenses = () => {
            return this.expenses.slice(0);
        };
        this.listRates = () => {
            return this.rates.slice(0);
        };
        this.addExpense = (expense) => {
            this.nextIds.expenses = this.addItem(expense, this.expenses, this.nextIds.expenses);
        };
        this.addRate = (rate) => {
            this.nextIds.rates = this.addItem(rate, this.rates, this.nextIds.rates);
        };
        this.getExpense = (id) => {
            return this.getItem(id, this.expenses);
        };
        this.getRate = (id) => {
            return this.getItem(id, this.rates);
        };
        this.removeExpense = (id) => {
            this.expenses = this.removeItem(id, this.expenses);
        };
        this.removeRate = (id) => {
            this.rates = this.removeItem(id, this.rates);
        };
        this.expenses = [];
        this.rates = [];
        this.nextIds = {
            expenses: 1,
            rates: 1
        };
        this.updateCallbacks = [];
    }
    parseDate(value) {
        return moment(value);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BudgetContext;
//# sourceMappingURL=budgetcontext.js.map