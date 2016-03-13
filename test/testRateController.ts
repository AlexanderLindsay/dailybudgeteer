import * as ava from "ava";
import * as moment from "moment";
import BudgetContext from "../client/data/budgetcontext";
import Expense from "../client/expenses/expense";
import * as it from "../client/rates/intervaltype";
import Rate from "../client/rates/rate";
import {RateDataSource, RateController} from "../client/rates/ratecontroller";

ava.test.beforeEach(t => {
    t.context.budgetContext = new BudgetContext();
    t.context.date = moment([2016, 0, 5]);
    t.context.controller = new RateController(t.context.budgetContext,
        t.context.date);
});

ava.test("update", t => {
    let bc: BudgetContext = t.context.budgetContext;
    let date = t.context.date;
    let controller: RateController = t.context.controller;

    t.is(controller.vm.list().length, 0);

    bc.addRate(new Rate("test", -25, 1, it.IntervalType.Days, date));
    t.is(controller.vm.list().length, 1);
});

ava.test("add", t => {
    let bc: BudgetContext = t.context.budgetContext;
    let date = t.context.date;
    let controller: RateController = t.context.controller;

    let rate = controller.vm.item();
    rate.name("test");
    rate.amount(-25);
    rate.interval(1);
    rate.intervalType(it.IntervalType.Days);
    controller.vm.save();

    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), -25);
    t.is(controller.vm.list()[0].name(), "test");

    controller.vm.remove(1);
    t.is(controller.vm.list().length, 0);
});

ava.test("total", t => {
    let bc: BudgetContext = t.context.budgetContext;
    let date = t.context.date;
    let controller: RateController = t.context.controller;

    let rate = new Rate("day", -25, 1, it.IntervalType.Days, date);
    let total = rate.perDiem(date);
    controller.vm.item(rate);
    controller.vm.save();

    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), total);
    t.is(controller.vm.list()[0].name(), "day");

    rate = new Rate("month", -25, 1, it.IntervalType.Month, date);
    total += rate.perDiem(date);
    controller.vm.item(rate);
    controller.vm.save();

    t.is(controller.vm.list().length, 2);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.list()[1].id(), 2);
    t.is(controller.vm.total(), total);
    t.is(controller.vm.list()[0].name(), "day");
    t.is(controller.vm.list()[1].name(), "month");

    rate = new Rate("year", -25, 1, it.IntervalType.Year, date);
    total += rate.perDiem(date);
    controller.vm.item(rate);
    controller.vm.save();

    t.is(controller.vm.list().length, 3);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.list()[1].id(), 2);
    t.is(controller.vm.list()[2].id(), 3);
    t.is(controller.vm.total(), total);
    t.is(controller.vm.list()[0].name(), "day");
    t.is(controller.vm.list()[1].name(), "month");
    t.is(controller.vm.list()[2].name(), "year");
});

ava.test("filter list", t => {
    let bc: BudgetContext = t.context.budgetContext;
    let date = t.context.date;
    let controller: RateController = t.context.controller;

    let rate = new Rate("day", -25, 1, it.IntervalType.Days, date);
    let total = rate.perDiem(date);
    controller.vm.item(rate);
    controller.vm.save();

    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), total);
    t.is(controller.vm.list()[0].name(), "day");

    let rate2 = new Rate("diff", -25, 1, it.IntervalType.Month,
        moment([2015, 0, 3]), moment([2015, 0, 4]));
    total += rate2.perDiem(date);
    controller.vm.item(rate2);
    controller.vm.save();

    t.is(controller.vm.list().length, 1);
    t.is(controller.vm.list()[0].id(), 1);
    t.is(controller.vm.total(), rate.perDiem(date));
    t.not(controller.vm.total(), total);
    t.is(controller.vm.list()[0].name(), "day");
});