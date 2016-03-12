import * as ava from "ava";
import * as moment from "moment";
import BudgetContext from "../client/data/budgetcontext";
import Expense from "../client/expenses/expense";
import * as it from "../client/rates/intervaltype";
import Rate from "../client/rates/rate";
import * as expenses from "../client/expenses/expensewidgetcontroller";

ava.test.beforeEach(t => {
    t.context.budgetContext = new BudgetContext();
});

ava.test("update", t => {
    let bc = t.context.budgetContext;
    let date = moment([2016, 0, 5]);
    let controller = new expenses.ExpenseWidgetController(bc, date);

    t.is(controller.vm.list().length, 0);
    bc.addExpense(new Expense("test", date, -25));
    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), -25);

    controller.vm.remove(1);
    t.is(controller.vm.list().length, 0);
});

ava.test("add", t => {
    let bc = t.context.budgetContext;
    let date = moment([2016, 0, 5]);
    let controller = new expenses.ExpenseWidgetController(bc, date);

    let expense = controller.vm.item();
    expense.name("test");
    expense.day(date);
    expense.amount(-25);
    controller.vm.save();

    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), -25);
    t.is(controller.vm.list()[0].name(), "test");
});

ava.test("base rate", t => {
    let bc: BudgetContext = t.context.budgetContext;
    let date = moment([2016, 0, 5]);
    let controller = new expenses.ExpenseWidgetController(bc, date);

    bc.addRate(new Rate("test", -25, 1, it.IntervalType.Days,
        moment([2016, 0, 4]), moment([2016, 0, 10])));

    let expense = controller.vm.item();
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

ava.test("filter list", t => {
    let bc = t.context.budgetContext;
    let date = moment([2016, 0, 5]);
    let controller = new expenses.ExpenseWidgetController(bc, date);

    let expense = new Expense("test", date, -25);
    controller.vm.item(expense);
    controller.vm.save();

    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), -25);
    t.is(controller.vm.list()[0].name(), "test");

    expense = new Expense("test", moment([2016, 0, 4]), -25);
    controller.vm.item(expense);
    controller.vm.save();

    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), -25);
    t.is(controller.vm.list()[0].name(), "test");
});