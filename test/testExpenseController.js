define(["require", "exports", "ava", "moment", "../client/data/budgetcontext", "../client/expenses/expense", "../client/rates/intervaltype", "../client/rates/rate", "../client/expenses/expensecontroller"], function (require, exports, ava, moment, budgetcontext_1, expense_1, it, rate_1, expensecontroller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava.test.beforeEach(function (t) {
        t.context.budgetContext = new budgetcontext_1.default();
    });
    ava.test("update", function (t) {
        var bc = t.context.budgetContext;
        var date = moment([2016, 0, 5]);
        var controller = new expensecontroller_1.ExpenseController(bc, date);
        t.is(controller.vm.list().length, 0);
        bc.addExpense(new expense_1.default("test", date, -25));
        t.is(controller.vm.list().length, 1);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.total(), -25);
        controller.vm.remove(1);
        t.is(controller.vm.list().length, 0);
    });
    ava.test("add", function (t) {
        var bc = t.context.budgetContext;
        var date = moment([2016, 0, 5]);
        var controller = new expensecontroller_1.ExpenseController(bc, date);
        var expense = controller.vm.item();
        expense.name("test");
        expense.day(date);
        expense.amount(-25);
        controller.vm.save();
        t.is(controller.vm.list().length, 1);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.total(), -25);
        t.is(controller.vm.list()[0].name(), "test");
    });
    ava.test("base rate", function (t) {
        var bc = t.context.budgetContext;
        var date = moment([2016, 0, 5]);
        var controller = new expensecontroller_1.ExpenseController(bc, date);
        bc.addRate(new rate_1.default("test", -25, 1, it.IntervalType.Days, moment([2016, 0, 4]), moment([2016, 0, 10])));
        var expense = controller.vm.item();
        expense.name("test");
        expense.day(date);
        expense.amount(-25);
        controller.vm.save();
        t.is(controller.vm.list().length, 2);
        t.is(controller.vm.list()[1].id(), 1);
        t.is(controller.vm.total(), -50);
        t.is(controller.vm.list()[0].name(), "Base");
        t.is(controller.vm.list()[1].name(), "test");
        t.true(controller.vm.allowEdit(1));
        t.true(controller.vm.allowRemove(1));
    });
    ava.test("filter list", function (t) {
        var bc = t.context.budgetContext;
        var date = moment([2016, 0, 5]);
        var controller = new expensecontroller_1.ExpenseController(bc, date);
        var expense = new expense_1.default("test", date, -25);
        controller.vm.item(expense);
        controller.vm.save();
        t.is(controller.vm.list().length, 1);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.total(), -25);
        t.is(controller.vm.list()[0].name(), "test");
        expense = new expense_1.default("test", moment([2016, 0, 4]), -25);
        controller.vm.item(expense);
        controller.vm.save();
        t.is(controller.vm.list().length, 1);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.total(), -25);
        t.is(controller.vm.list()[0].name(), "test");
    });
});
//# sourceMappingURL=testExpenseController.js.map