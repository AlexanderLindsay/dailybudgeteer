/// <reference path="datacontext.ts" />
/// <reference path="../rates/rate.ts" />
/// <reference path="../expenses/expense.ts" />

namespace Data {
    "use strict";

    type Expense = ExpenseWidget.Expense;
    type Rate = RateWidget.Rate;

    export class BudgetContext extends DataContext {

        private expenses: Expense[];
        private rates: Rate[];
        private nextIds: {
            expenses: number;
            rates: number;
        };

        constructor() {
            super();
            this.expenses = [];
            this.rates = [];
            this.nextIds = {
                expenses: 0,
                rates: 0
            };
        }

        private parseDate(value: string) {
            let timestamp = Date.parse(value);
            if (isNaN(timestamp) === false) {
                return new Date(timestamp);
            }
            return null;
        }

        public loadData = (json: string) => {
            let data = JSON.parse(json);
            m.startComputation();
            this.expenses = data.expenses.map((raw: any) => {
                let expense = new ExpenseWidget.Expense(raw.name, raw.day, raw.amount);
                expense.id(raw.id);
                return expense;
            }) || [];
            this.rates = data.rates.map((raw: any) => {
                let rate = new RateWidget.Rate(
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
                expenses: 0,
                rates: 0
            };
            m.endComputation();
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
}