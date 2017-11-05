define(["require", "exports", "ava", "moment", "../client/data/budgetcontext", "../client/expenses/expense", "../client/rates/intervaltype", "../client/rates/rate", "../client/categories/category"], function (require, exports, ava, moment, budgetcontext_1, expense_1, it, rate_1, category_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava.test("Round trip data", function (t) {
        var rate1 = {
            id: 1,
            name: "test rate",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
            endDate: moment()
        };
        var rate2 = {
            id: 2,
            name: "test rate2",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
        };
        var expense1 = {
            id: 1,
            name: "test expense",
            day: moment(),
            amount: -50
        };
        var expense2 = {
            id: 2,
            name: "test expense2",
            day: moment(),
            amount: -75
        };
        var data = JSON.stringify({
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
        var expecteddata = JSON.stringify({
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
        var bc = new budgetcontext_1.default();
        bc.loadData(data);
        t.is(bc.writeData(), expecteddata);
    });
    ava.test("Round trip data with categories", function (t) {
        var rate1 = {
            id: 1,
            name: "test rate",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
            endDate: moment()
        };
        var rate2 = {
            id: 2,
            name: "test rate2",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
        };
        var expense1 = {
            id: 1,
            name: "test expense",
            day: moment(),
            amount: -50
        };
        var expense2 = {
            id: 2,
            name: "test expense2",
            day: moment(),
            amount: -75
        };
        var expense3 = {
            id: 3,
            name: "test expense3",
            day: moment(),
            amount: -25,
            category: 1
        };
        var category1 = {
            id: 1,
            name: "test category",
            description: "a test category"
        };
        var data = JSON.stringify({
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
        var bc = new budgetcontext_1.default();
        bc.loadData(data);
        t.is(bc.writeData(), data);
    });
    ava.test("callback", function (t) {
        var rate = {
            id: 1,
            name: "test rate",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
            endDate: moment()
        };
        var expense = {
            id: 1,
            name: "test expense",
            day: moment(),
            amount: -50
        };
        var data = JSON.stringify({
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
        var bc = new budgetcontext_1.default();
        var works = false;
        bc.addUpdateCallback(function () { works = true; });
        bc.loadData(data);
        t.is(bc.writeData(), data);
        t.true(works);
    });
    ava.test("listExpenses", function (t) {
        var expenseData = {
            id: 1,
            name: "test expense",
            day: moment(),
            amount: -50
        };
        var data = JSON.stringify({
            expenses: [
                expenseData
            ],
            rates: [],
            nextIds: {
                expenses: 2,
                rates: 1
            }
        });
        var expense = new expense_1.default(expenseData.name, expenseData.day, expenseData.amount);
        expense.id(expenseData.id);
        var bc = new budgetcontext_1.default();
        bc.loadData(data);
        var expenses = bc.listExpenses();
        t.is(expenses.length, 1);
        t.is(expenses[0].id(), expense.id());
        t.is(expenses[0].name(), expense.name());
    });
    ava.test("listRates", function (t) {
        var rateData = {
            id: 1,
            name: "test rate",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
            endDate: moment()
        };
        var data = JSON.stringify({
            expenses: [],
            rates: [rateData],
            nextIds: {
                expenses: 2,
                rates: 1
            }
        });
        var rate = new rate_1.default(rateData.name, rateData.amount, rateData.interval, rateData.intervalType, rateData.startDate, rateData.endDate);
        rate.id(rateData.id);
        var bc = new budgetcontext_1.default();
        bc.loadData(data);
        var rates = bc.listRates();
        t.is(rates.length, 1);
        t.is(rates[0].id(), rate.id());
        t.is(rates[0].name(), rate.name());
    });
    ava.test("listCategories", function (t) {
        var categoryData = {
            id: 1,
            name: "test category",
            description: "test categpry description"
        };
        var data = JSON.stringify({
            expenses: [],
            rates: [],
            categories: [categoryData],
            nextIds: {
                expenses: 1,
                rates: 1,
                categories: 2
            }
        });
        var category = new category_1.default();
        category.id(categoryData.id);
        category.name(categoryData.name);
        category.description(categoryData.description);
        var bc = new budgetcontext_1.default();
        bc.loadData(data);
        var categories = bc.listCategories();
        t.is(categories.length, 1);
        t.is(categories[0].id(), category.id());
        t.is(categories[0].name(), category.name());
        t.is(categories[0].description(), category.description());
    });
    ava.test("addExpense", function (t) {
        var bc = new budgetcontext_1.default();
        var expense = new expense_1.default("test", moment(), -25);
        bc.addExpense(expense);
        var expenses = bc.listExpenses();
        t.is(expenses[0], expense);
        t.is(expenses[0].id(), 1);
        t.is(bc.getExpense(1), expense);
    });
    ava.test("addExpense - ids", function (t) {
        var bc = new budgetcontext_1.default();
        var expense1 = new expense_1.default("test", moment(), -25);
        var expense2 = new expense_1.default("two", moment(), -50);
        bc.addExpense(expense1);
        var expenses1 = bc.listExpenses();
        t.is(expenses1[0], expense1);
        t.is(expenses1[0].id(), 1);
        t.is(bc.getExpense(1), expense1);
        bc.addExpense(expense2);
        var expenses2 = bc.listExpenses();
        t.is(expenses1.length, 1);
        t.is(expenses2.length, 2);
        t.is(expenses2[0], expense1);
        t.is(expenses2[0].id(), 1);
        t.is(expenses2[1], expense2);
        t.is(expenses2[1].id(), 2);
        t.is(bc.getExpense(1), expense1);
        t.is(bc.getExpense(2), expense2);
    });
    ava.test("addRate", function (t) {
        var bc = new budgetcontext_1.default();
        var rate = new rate_1.default("test", -25, 1, it.IntervalType.Days, moment(), moment());
        bc.addRate(rate);
        var rates = bc.listRates();
        t.is(rates[0], rate);
        t.is(rates[0].id(), 1);
        t.is(bc.getRate(1), rate);
    });
    ava.test("addRate - ids", function (t) {
        var bc = new budgetcontext_1.default();
        var rate1 = new rate_1.default("test", -25, 1, it.IntervalType.Days, moment(), moment());
        var rate2 = new rate_1.default("two", -200, 1, it.IntervalType.Days, moment(), moment());
        bc.addRate(rate1);
        var rates1 = bc.listRates();
        t.is(rates1[0], rate1);
        t.is(rates1[0].id(), 1);
        t.is(bc.getRate(1), rate1);
        bc.addRate(rate2);
        var rates2 = bc.listRates();
        t.is(rates1.length, 1);
        t.is(rates2.length, 2);
        t.is(rates2[0], rate1);
        t.is(rates2[0].id(), 1);
        t.is(rates2[1], rate2);
        t.is(rates2[1].id(), 2);
        t.is(bc.getRate(1), rate1);
        t.is(bc.getRate(2), rate2);
    });
    ava.test("addCategory", function (t) {
        var bc = new budgetcontext_1.default();
        var category = new category_1.default();
        category.name("test");
        category.description("test category");
        bc.addCategory(category);
        var categories = bc.listCategories();
        t.is(categories[0], category);
        t.is(categories[0].id(), 1);
        t.is(bc.getCategory(1), category);
    });
    ava.test("addCategory - ids", function (t) {
        var bc = new budgetcontext_1.default();
        var category1 = new category_1.default();
        category1.name("test1");
        category1.description("test category1");
        var category2 = new category_1.default();
        category2.name("test2");
        category2.description("test category2");
        bc.addCategory(category1);
        var categories1 = bc.listCategories();
        t.is(categories1[0], category1);
        t.is(categories1[0].id(), 1);
        t.is(bc.getCategory(1), category1);
        bc.addCategory(category2);
        var categories2 = bc.listCategories();
        t.is(categories1.length, 1);
        t.is(categories2.length, 2);
        t.is(categories2[0], category1);
        t.is(categories2[0].id(), 1);
        t.is(categories2[1], category2);
        t.is(categories2[1].id(), 2);
        t.is(bc.getCategory(1), category1);
        t.is(bc.getCategory(2), category2);
    });
    ava.test("clear", function (t) {
        var rate1 = {
            id: 1,
            name: "test rate",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
            endDate: moment()
        };
        var rate2 = {
            id: 2,
            name: "test rate2",
            amount: -100,
            interval: 1,
            intervalType: 0,
            startDate: moment(),
        };
        var expense1 = {
            id: 1,
            name: "test expense",
            day: moment(),
            amount: -50
        };
        var expense2 = {
            id: 2,
            name: "test expense2",
            day: moment(),
            amount: -75
        };
        var category1 = {
            id: 1,
            name: "test category",
            description: "a test category"
        };
        var data = JSON.stringify({
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
        var bc = new budgetcontext_1.default();
        bc.loadData(data);
        t.is(bc.writeData(), data);
        var expected = JSON.stringify({
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
});
//# sourceMappingURL=testBudgetContext.js.map