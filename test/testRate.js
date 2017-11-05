define(["require", "exports", "ava", "moment", "../client/rates/intervaltype", "../client/rates/rate"], function (require, exports, ava, moment, it, rate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava.test("allowInterval - day", function (t) {
        var r = new rate_1.default("test", -25, 1, it.IntervalType.Days);
        t.is(r.allowInterval(), true);
    });
    ava.test("allowInterval - month", function (t) {
        var r = new rate_1.default("test", -25, 1, it.IntervalType.Month);
        t.is(r.allowInterval(), false);
    });
    ava.test("allowInterval - year", function (t) {
        var r = new rate_1.default("test", -25, 1, it.IntervalType.Year);
        t.is(r.allowInterval(), false);
    });
    ava.test("allowInterval - changes", function (t) {
        var r = new rate_1.default("test", -25, 1, it.IntervalType.Days);
        t.is(r.allowInterval(), true);
        r.intervalType(it.IntervalType.Month);
        t.is(r.allowInterval(), false);
        r.intervalType(it.IntervalType.Year);
        t.is(r.allowInterval(), false);
    });
    ava.test("expire", function (t) {
        var r = new rate_1.default("test", -25, 1, it.IntervalType.Days, moment([2016, 0, 15]));
        t.is(r.endDate(), undefined);
        var expireDate = moment([2016, 3, 10]);
        r.expireOn(expireDate);
        t.is(r.endDate(), expireDate);
    });
    ava.test("perDiem - day - 0", function (t) {
        var amount = -25;
        var interval = 0;
        var r = new rate_1.default("test", amount, interval, it.IntervalType.Days);
        t.is(r.perDiem(moment()), 0);
    });
    ava.test("perDiem - day - negative", function (t) {
        var amount = -25;
        var interval = -10;
        var r = new rate_1.default("test", amount, interval, it.IntervalType.Days);
        t.is(r.perDiem(moment()), 0);
    });
    ava.test("perDiem - day - 1", function (t) {
        var amount = -25;
        var interval = 1;
        var r = new rate_1.default("test", amount, interval, it.IntervalType.Days);
        t.is(r.perDiem(moment()), amount);
    });
    ava.test("perDiem - day - 5", function (t) {
        var amount = -25;
        var interval = 5;
        var expected = amount / interval;
        var r = new rate_1.default("test", amount, interval, it.IntervalType.Days);
        t.is(r.perDiem(moment()), expected);
    });
    ava.test("perDiem - day - 10", function (t) {
        var amount = -25;
        var interval = 10;
        var expected = amount / interval;
        var r = new rate_1.default("test", amount, interval, it.IntervalType.Days);
        t.is(r.perDiem(moment()), expected);
    });
    ava.test("perDiem - day - 100", function (t) {
        var amount = -25;
        var interval = 100;
        var expected = amount / interval;
        var r = new rate_1.default("test", amount, interval, it.IntervalType.Days);
        t.is(r.perDiem(moment()), expected);
    });
    ava.test("perDiem - month - feb2016", function (t) {
        var amount = -25;
        var month = moment([2016, 1, 1]); // months in moment are zero indexed
        var expected = amount / month.daysInMonth();
        var r = new rate_1.default("test", amount, 1, it.IntervalType.Month);
        t.is(r.perDiem(month), expected);
    });
    ava.test("perDiem - month - feb2016 - interval", function (t) {
        var amount = -25;
        var month = moment([2016, 1, 1]);
        var expected = amount / month.daysInMonth();
        var r = new rate_1.default("test", amount, 10, it.IntervalType.Month);
        t.is(r.perDiem(month), expected);
    });
    ava.test("perDiem - month - jan2016", function (t) {
        var amount = -25;
        var month = moment([2016, 0, 1]);
        var expected = amount / month.daysInMonth();
        var r = new rate_1.default("test", amount, 1, it.IntervalType.Month);
        t.is(r.perDiem(month), expected);
    });
    ava.test("perDiem - month - april2016", function (t) {
        var amount = -25;
        var month = moment([2016, 3, 1]);
        var expected = amount / month.daysInMonth();
        var r = new rate_1.default("test", amount, 1, it.IntervalType.Month);
        t.is(r.perDiem(month), expected);
    });
    ava.test("perDiem - year - non leap", function (t) {
        var amount = -25;
        var year = moment([2015, 1, 1]);
        var expected = amount / 365;
        var r = new rate_1.default("test", amount, 1, it.IntervalType.Year);
        t.is(r.perDiem(year), expected);
    });
    ava.test("perDiem - year - leap", function (t) {
        var amount = -25;
        var year = moment([2016, 1, 1]);
        var expected = amount / 366;
        var r = new rate_1.default("test", amount, 1, it.IntervalType.Year);
        t.is(r.perDiem(year), expected);
    });
    ava.test("toJSON", function (t) {
        var name = "test";
        var amount = -124;
        var interval = 30;
        var intervalType = it.IntervalType.Days;
        var start = moment();
        var end = moment();
        var r = new rate_1.default(name, amount, interval, intervalType, start, end);
        r.id(1);
        t.deepEqual(r.toJSON(), {
            id: 1,
            name: name,
            amount: amount,
            interval: interval,
            intervalType: intervalType,
            startDate: start,
            endDate: end
        });
    });
    ava.test("toJSON - null start/end", function (t) {
        var name = "test";
        var amount = -124;
        var interval = 30;
        var intervalType = it.IntervalType.Days;
        var r = new rate_1.default(name, amount, interval, intervalType);
        r.id(1);
        t.deepEqual(r.toJSON(), {
            id: 1,
            name: name,
            amount: amount,
            interval: interval,
            intervalType: intervalType,
            startDate: undefined,
            endDate: undefined
        });
    });
    ava.test("clone", function (t) {
        var rOne = new rate_1.default("One", -25, 1, it.IntervalType.Days, moment(), moment());
        rOne.id(1);
        var rTwo = rOne.clone();
        t.is(rTwo.id(), 1);
        t.is(rTwo.id(), rOne.id());
        t.is(rTwo.name(), rOne.name());
        t.is(rTwo.amount(), rOne.amount());
        t.is(rTwo.intervalType(), rOne.intervalType());
        t.true(rTwo.startDate().isSame(rOne.startDate()));
        t.true(rTwo.endDate().isSame(rOne.endDate()));
        rTwo.name("Two");
        t.is(rOne.name(), "One");
        t.is(rTwo.name(), "Two");
        rTwo.startDate().add(1, "day");
        t.false(rOne.startDate().isSame(rTwo.startDate()));
        rTwo.endDate().add(1, "day");
        t.false(rOne.endDate().isSame(rTwo.endDate()));
    });
    ava.test("update", function (t) {
        var name1 = "One";
        var amount1 = -25;
        var interval1 = 1;
        var intervalType = it.IntervalType.Days;
        var name2 = "One.1";
        var amount2 = -30;
        var interval2 = 5;
        var rOne = new rate_1.default(name1, amount1, interval1, intervalType);
        rOne.id(1);
        var modified = new rate_1.default(name2, amount2, interval2, intervalType);
        modified.id(2);
        rOne.update(modified);
        t.is(rOne.id(), 1);
        t.is(rOne.name(), name2);
        t.is(rOne.amount(), amount2);
        t.is(rOne.interval(), interval2);
    });
    ava.test("update - with start/end", function (t) {
        var name1 = "One";
        var amount1 = -25;
        var interval1 = 1;
        var start1 = moment([2016, 1, 10]);
        var end1 = moment([2016, 2, 1]);
        var intervalType = it.IntervalType.Days;
        var name2 = "One.1";
        var amount2 = -30;
        var interval2 = 5;
        var start2 = moment([2016, 2, 10]);
        var end2 = moment([2016, 3, 1]);
        var rOne = new rate_1.default(name1, amount1, interval1, intervalType, start1, end1);
        rOne.id(1);
        var modified = new rate_1.default(name2, amount2, interval2, intervalType, start2, end2);
        modified.id(2);
        rOne.update(modified);
        t.is(rOne.id(), 1);
        t.is(rOne.name(), name2);
        t.is(rOne.amount(), amount2);
        t.is(rOne.interval(), interval2);
        t.true(rOne.startDate().isSame(start2));
        t.true(rOne.endDate().isSame(end2));
    });
    ava.test("update - add start/end", function (t) {
        var name1 = "One";
        var amount1 = -25;
        var interval1 = 1;
        var intervalType = it.IntervalType.Days;
        var name2 = "One.1";
        var amount2 = -30;
        var interval2 = 5;
        var start2 = moment([2016, 2, 10]);
        var end2 = moment([2016, 3, 1]);
        var rOne = new rate_1.default(name1, amount1, interval1, intervalType);
        rOne.id(1);
        var modified = new rate_1.default(name2, amount2, interval2, intervalType, start2, end2);
        modified.id(2);
        rOne.update(modified);
        t.is(rOne.id(), 1);
        t.is(rOne.name(), name2);
        t.is(rOne.amount(), amount2);
        t.is(rOne.interval(), interval2);
        t.is(rOne.startDate().isSame(start2), true);
        t.is(rOne.endDate().isSame(end2), true);
    });
});
//# sourceMappingURL=testRate.js.map