import * as ava from "ava";
import * as moment from "moment";
import BudgetContext from "../client/data/budgetcontext";
import Expense from "../client/expenses/expense";
import * as it from "../client/rates/intervaltype";
import Rate from "../client/rates/rate";

ava.test("Round trip data", (t) => {
    let rate = {
        id: 1,
        name: "test rate",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
        endDate: moment()
    };

    let expense = {
        id: 1,
        name: "test expense",
        day: moment(),
        amount: -50
    };

    let data = JSON.stringify({
        expenses: [
            expense
        ],
        rates: [
            rate
        ],
        nextIds: {
            expenses: 2,
            rates: 2
        }
    });

    let bc = new BudgetContext();
    bc.loadData(data);
    t.is(bc.writeData(), data);
});

ava.test("callback", (t) => {
    let rate = {
        id: 1,
        name: "test rate",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
        endDate: moment()
    };

    let expense = {
        id: 1,
        name: "test expense",
        day: moment(),
        amount: -50
    };

    let data = JSON.stringify({
        expenses: [
            expense
        ],
        rates: [
            rate
        ],
        nextIds: {
            expenses: 2,
            rates: 2
        }
    });

    let bc = new BudgetContext();
    let works = false;
    bc.addUpdateCallback(() => { works = true; });
    bc.loadData(data);
    t.is(bc.writeData(), data);
    t.true(works);
});

ava.test("listExpenses", (t) => {
    let expenseData = {
        id: 1,
        name: "test expense",
        day: moment(),
        amount: -50
    };

    let data = JSON.stringify({
        expenses: [
            expenseData
        ],
        rates: [],
        nextIds: {
            expenses: 2,
            rates: 1
        }
    });

    let expense = new Expense(expenseData.name, expenseData.day, expenseData.amount);
    expense.id(expenseData.id);

    let bc = new BudgetContext();
    bc.loadData(data);
    let expenses = bc.listExpenses();
    t.is(expenses.length, 1);
    t.is(expenses[0].id(), expense.id());
    t.is(expenses[0].name(), expense.name());
});

ava.test("listRates", (t) => {
    let rateData = {
        id: 1,
        name: "test rate",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
        endDate: moment()
    };

    let data = JSON.stringify({
        expenses: [],
        rates: [rateData],
        nextIds: {
            expenses: 2,
            rates: 1
        }
    });

    let rate = new Rate(rateData.name, rateData.amount, rateData.interval,
        rateData.intervalType, rateData.startDate, rateData.endDate);
    rate.id(rateData.id);

    let bc = new BudgetContext();
    bc.loadData(data);
    let rates = bc.listRates();
    t.is(rates.length, 1);
    t.is(rates[0].id(), rate.id());
    t.is(rates[0].name(), rate.name());
});

ava.test("addExpense", (t) => {
    let bc = new BudgetContext();
    let expense = new Expense("test", moment(), -25);

    bc.addExpense(expense);
    let expenses = bc.listExpenses();

    t.is(expenses[0], expense);
    t.is(expenses[0].id(), 1);
    t.is(bc.getExpense(1), expense);
});

ava.test("addExpense - ids", (t) => {
    let bc = new BudgetContext();
    let expense1 = new Expense("test", moment(), -25);
    let expense2 = new Expense("two", moment(), -50);

    bc.addExpense(expense1);
    let expenses1 = bc.listExpenses();

    t.is(expenses1[0], expense1);
    t.is(expenses1[0].id(), 1);
    t.is(bc.getExpense(1), expense1);

    bc.addExpense(expense2);
    let expenses2 = bc.listExpenses();

    t.is(expenses1.length, 1);
    t.is(expenses2.length, 2);

    t.is(expenses2[0], expense1);
    t.is(expenses2[0].id(), 1);
    t.is(expenses2[1], expense2);
    t.is(expenses2[1].id(), 2);
    t.is(bc.getExpense(1), expense1);
    t.is(bc.getExpense(2), expense2);
});

ava.test("addRate", (t) => {
    let bc = new BudgetContext();
    let rate = new Rate("test", -25, 1, it.IntervalType.Days, moment(), moment());

    bc.addRate(rate);
    let rates = bc.listRates();

    t.is(rates[0], rate);
    t.is(rates[0].id(), 1);
    t.is(bc.getRate(1), rate);
});

ava.test("addRate - ids", (t) => {
    let bc = new BudgetContext();
    let rate1 = new Rate("test", -25, 1, it.IntervalType.Days, moment(), moment());
    let rate2 = new Rate("two", -200, 1, it.IntervalType.Days, moment(), moment());

    bc.addRate(rate1);
    let rates1 = bc.listRates();

    t.is(rates1[0], rate1);
    t.is(rates1[0].id(), 1);
    t.is(bc.getRate(1), rate1);

    bc.addRate(rate2);
    let rates2 = bc.listRates();

    t.is(rates1.length, 1);
    t.is(rates2.length, 2);

    t.is(rates2[0], rate1);
    t.is(rates2[0].id(), 1);
    t.is(rates2[1], rate2);
    t.is(rates2[1].id(), 2);
    t.is(bc.getRate(1), rate1);
    t.is(bc.getRate(2), rate2);
});