define(["require", "exports", "ava", "moment", "../client/data/budgetcontext", "../client/rates/intervaltype", "../client/rates/rate", "../client/rates/ratecontroller"], function (require, exports, ava, moment, budgetcontext_1, it, rate_1, ratecontroller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava.test.beforeEach(function (t) {
        t.context.budgetContext = new budgetcontext_1.default();
        t.context.date = moment([2016, 0, 5]);
        t.context.controller = new ratecontroller_1.RateController(t.context.budgetContext, t.context.date);
    });
    ava.test("update", function (t) {
        var bc = t.context.budgetContext;
        var date = t.context.date;
        var controller = t.context.controller;
        t.is(controller.vm.list().length, 0);
        bc.addRate(new rate_1.default("test", -25, 1, it.IntervalType.Days, date));
        t.is(controller.vm.list().length, 1);
    });
    ava.test("add", function (t) {
        var bc = t.context.budgetContext;
        var date = t.context.date;
        var controller = t.context.controller;
        var rate = controller.vm.item();
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
    ava.test("total", function (t) {
        var bc = t.context.budgetContext;
        var date = t.context.date;
        var controller = t.context.controller;
        var rate = new rate_1.default("day", -25, 1, it.IntervalType.Days, date);
        var total = rate.perDiem(date);
        controller.vm.item(rate);
        controller.vm.save();
        t.is(controller.vm.list().length, 1);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.total(), total);
        t.is(controller.vm.list()[0].name(), "day");
        rate = new rate_1.default("month", -25, 1, it.IntervalType.Month, date);
        total += rate.perDiem(date);
        controller.vm.item(rate);
        controller.vm.save();
        t.is(controller.vm.list().length, 2);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.list()[1].id(), 2);
        t.is(controller.vm.total(), total);
        t.is(controller.vm.list()[0].name(), "day");
        t.is(controller.vm.list()[1].name(), "month");
        rate = new rate_1.default("year", -25, 1, it.IntervalType.Year, date);
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
    ava.test("filter list", function (t) {
        var bc = t.context.budgetContext;
        var date = t.context.date;
        var controller = t.context.controller;
        var rate = new rate_1.default("day", -25, 1, it.IntervalType.Days, date);
        var total = rate.perDiem(date);
        controller.vm.item(rate);
        controller.vm.save();
        t.is(controller.vm.list().length, 1);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.total(), total);
        t.is(controller.vm.list()[0].name(), "day");
        var rate2 = new rate_1.default("diff", -25, 1, it.IntervalType.Month, moment([2015, 0, 3]), moment([2015, 0, 4]));
        total += rate2.perDiem(date);
        controller.vm.item(rate2);
        controller.vm.save();
        t.is(controller.vm.list().length, 1);
        t.is(controller.vm.list()[0].id(), 1);
        t.is(controller.vm.total(), rate.perDiem(date));
        t.not(controller.vm.total(), total);
        t.is(controller.vm.list()[0].name(), "day");
    });
});
//# sourceMappingURL=testRateController.js.map