/// <reference path="keyed.ts" />
/// <reference path="../rates/rate.ts" />
/// <reference path="../expenses/expense.ts" />

namespace Data {

    type Expense = ExpenseWidget.Expense;
    type Rate = RateWidget.Rate;

    export class Context {

        private expenses: Expense[];
        private rates: Rate[];
        private nextIds: {
            expenses: number;
            rates: number;
        };

        constructor() {
            this.expenses = [];
            this.rates = [];
            this.nextIds = {
                expenses: 0,
                rates: 0
            };
        }

        public loadData(json: string) {
            let data = JSON.parse(json);
            this.expenses = data.expenses.map((raw: any) => {
                let expense = new ExpenseWidget.Expense(raw.name, raw.day, raw.amount);
                expense.id(raw.id);
                return expense;
            }) || [];
            this.rates = data.rates.map((raw: any) => {
                let rate = new RateWidget.Rate(raw.name, raw.amount, raw.days);
                rate.id(raw.id);
                rate.startDate(raw.startDate);
                rate.endDate(raw.endDate);
                return rate;
            }) || [];
            this.nextIds = data.nextIds || {
                expenses: 0,
                rates: 0
            };
        }

        public writeData() {
            let data = {
                expenses: this.expenses,
                rates: this.rates,
                nextIds: this.nextIds
            };

            return JSON.stringify(data);
        }

        public listExpenses() {
            return this.expenses.slice(0);
        }

        public listRates() {
            return this.rates.slice(0);
        }

        private addItem<T extends IKeyed>(item: T, list: T[], id: number) {
            item.id(id);
            list.push(item);
            return id + 1;
        }

        public addExpense(expense: Expense) {
            this.nextIds.expenses = this.addItem(expense, this.expenses, this.nextIds.expenses);
        }

        public addRate(rate: Rate) {
            this.nextIds.rates = this.addItem(rate, this.rates, this.nextIds.rates);
        }

        private getItem<T extends IKeyed>(id: number, list: T[]) {
            let results = list.filter((value: T, index: number) => {
                return value.id() === id;
            });

            if (results.length === 1) {
                return results[0];
            }

            if (results.length > 1) {
                throw "Duplicate id found";
            }

            return null;
        }

        public getExpense(id: number) {
            return this.getItem<Expense>(id, this.expenses);
        }

        public getRate(id: number) {
            return this.getItem<Rate>(id, this.rates);
        }

        private removeItem<T extends IKeyed>(id: number, list: T[]) {
            let ids = list.map((item) => {
                return item.id();
            });

            let index = ids.indexOf(id);

            list.splice(index, 1);
            return list;
        }

        public removeExpense(id: number) {
            this.expenses = this.removeItem(id, this.expenses);
        }

        public removeRate(id: number) {
            this.rates = this.removeItem(id, this.rates);
        }
    }
}