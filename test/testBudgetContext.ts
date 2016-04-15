import * as ava from "ava";
import * as moment from "moment";
import BudgetContext from "../client/data/budgetcontext";
import Expense from "../client/expenses/expense";
import * as it from "../client/rates/intervaltype";
import Rate from "../client/rates/rate";
import Category from "../client/categories/category";

ava.test("Round trip data", (t) => {
    let rate1 = {
        id: 1,
        name: "test rate",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
        endDate: moment()
    };

    let rate2 = {
        id: 2,
        name: "test rate2",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
    };

    let expense1 = {
        id: 1,
        name: "test expense",
        day: moment(),
        amount: -50
    };

    let expense2 = {
        id: 2,
        name: "test expense2",
        day: moment(),
        amount: -75
    };

    let data = JSON.stringify({
        expenses: [
            expense1,
            expense2
        ],
        rates: [
            rate1,
            rate2
        ],
        nextIds: {
            expenses: 3,
            rates: 3
        }
    });

    let expecteddata = JSON.stringify({
        expenses: [
            expense1,
            expense2
        ],
        rates: [
            rate1,
            rate2
        ],
        categories: [],
        nextIds: {
            expenses: 3,
            rates: 3,
            categories: 1
        }
    });

    let bc = new BudgetContext();
    bc.loadData(data);
    t.is(bc.writeData(), expecteddata);
});

ava.test("Round trip data with categories", (t) => {
    let rate1 = {
        id: 1,
        name: "test rate",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
        endDate: moment()
    };

    let rate2 = {
        id: 2,
        name: "test rate2",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
    };

    let expense1 = {
        id: 1,
        name: "test expense",
        day: moment(),
        amount: -50
    };

    let expense2 = {
        id: 2,
        name: "test expense2",
        day: moment(),
        amount: -75
    };

    let expense3 = {
        id: 3,
        name: "test expense3",
        day: moment(),
        amount: -25,
        category: 1
    };

    let category1 = {
        id: 1,
        name: "test category",
        description: "a test category"
    };

    let data = JSON.stringify({
        expenses: [
            expense1,
            expense2,
            expense3
        ],
        rates: [
            rate1,
            rate2
        ],
        categories: [
            category1
        ],
        nextIds: {
            expenses: 4,
            rates: 3,
            categories: 2
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
        categories: [],
        nextIds: {
            expenses: 2,
            rates: 2,
            categories: 1
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

ava.test("listCategories", (t) => {
    let categoryData = {
        id: 1,
        name: "test category",
        description: "test categpry description"
    };

    let data = JSON.stringify({
        expenses: [],
        rates: [],
        categories: [categoryData],
        nextIds: {
            expenses: 1,
            rates: 1,
            categories: 2
        }
    });

    let category = new Category();
    category.id(categoryData.id);
    category.name(categoryData.name);
    category.description(categoryData.description);

    let bc = new BudgetContext();
    bc.loadData(data);
    let categories = bc.listCategories();
    t.is(categories.length, 1);
    t.is(categories[0].id(), category.id());
    t.is(categories[0].name(), category.name());
    t.is(categories[0].description(), category.description());
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

ava.test("addCategory", (t) => {
    let bc = new BudgetContext();
    let category = new Category();
    category.name("test");
    category.description("test category");

    bc.addCategory(category);
    let categories = bc.listCategories();

    t.is(categories[0], category);
    t.is(categories[0].id(), 1);
    t.is(bc.getCategory(1), category);
});

ava.test("addCategory - ids", (t) => {
    let bc = new BudgetContext();

    let category1 = new Category();
    category1.name("test1");
    category1.description("test category1");

    let category2 = new Category();
    category2.name("test2");
    category2.description("test category2");

    bc.addCategory(category1);
    let categories1 = bc.listCategories();

    t.is(categories1[0], category1);
    t.is(categories1[0].id(), 1);
    t.is(bc.getCategory(1), category1);

    bc.addCategory(category2);
    let categories2 = bc.listCategories();

    t.is(categories1.length, 1);
    t.is(categories2.length, 2);

    t.is(categories2[0], category1);
    t.is(categories2[0].id(), 1);
    t.is(categories2[1], category2);
    t.is(categories2[1].id(), 2);
    t.is(bc.getCategory(1), category1);
    t.is(bc.getCategory(2), category2);
});

ava.test("clear", (t) => {
    let rate1 = {
        id: 1,
        name: "test rate",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
        endDate: moment()
    };

    let rate2 = {
        id: 2,
        name: "test rate2",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
    };

    let expense1 = {
        id: 1,
        name: "test expense",
        day: moment(),
        amount: -50
    };

    let expense2 = {
        id: 2,
        name: "test expense2",
        day: moment(),
        amount: -75
    };

    let category1 = {
        id: 1,
        name: "test category",
        description: "a test category"
    };

    let data = JSON.stringify({
        expenses: [
            expense1,
            expense2
        ],
        rates: [
            rate1,
            rate2
        ],
        categories: [
            category1
        ],
        nextIds: {
            expenses: 3,
            rates: 3,
            categories: 2
        }
    });

    let bc = new BudgetContext();
    bc.loadData(data);
    t.is(bc.writeData(), data);

    let expected = JSON.stringify({
        expenses: [],
        rates: [],
        categories: [],
        nextIds: {
            expenses: 1,
            rates: 1,
            categories: 1
        }
    });

    bc.clear();
    t.is(bc.writeData(), expected);
});