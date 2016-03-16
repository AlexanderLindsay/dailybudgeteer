import * as ava from "ava";
import * as moment from "moment";
import * as it from "../client/rates/intervaltype";
import Rate from "../client/rates/rate";

ava.test("allowInterval - day", (t) => {
    let r = new Rate("test", -25, 1, it.IntervalType.Days);
    t.is(r.allowInterval(), true);
});

ava.test("allowInterval - month", (t) => {
    let r = new Rate("test", -25, 1, it.IntervalType.Month);
    t.is(r.allowInterval(), false);
});

ava.test("allowInterval - year", (t) => {
    let r = new Rate("test", -25, 1, it.IntervalType.Year);
    t.is(r.allowInterval(), false);
});

ava.test("allowInterval - changes", (t) => {
    let r = new Rate("test", -25, 1, it.IntervalType.Days);
    t.is(r.allowInterval(), true);
    r.intervalType(it.IntervalType.Month);
    t.is(r.allowInterval(), false);
    r.intervalType(it.IntervalType.Year);
    t.is(r.allowInterval(), false);
});

ava.test("expire", (t) => {
    let r = new Rate("test", -25, 1, it.IntervalType.Days, moment([2016, 0, 15]));
    t.is(r.endDate(), undefined);
    let expireDate = moment([2016, 3, 10]);
    r.expireOn(expireDate);
    t.is(r.endDate(), expireDate);
});

ava.test("perDiem - day - 0", (t) => {
    let amount = -25;
    const interval = 0;

    let r = new Rate("test", amount, interval, it.IntervalType.Days);
    t.is(r.perDiem(moment()), 0);
});

ava.test("perDiem - day - negative", (t) => {
    let amount = -25;
    const interval = -10;

    let r = new Rate("test", amount, interval, it.IntervalType.Days);
    t.is(r.perDiem(moment()), 0);
});

ava.test("perDiem - day - 1", (t) => {
    let amount = -25;
    const interval = 1;

    let r = new Rate("test", amount, interval, it.IntervalType.Days);
    t.is(r.perDiem(moment()), amount);
});

ava.test("perDiem - day - 5", (t) => {
    let amount = -25;
    const interval = 5;
    const expected = amount / interval;

    let r = new Rate("test", amount, interval, it.IntervalType.Days);
    t.is(r.perDiem(moment()), expected);
});

ava.test("perDiem - day - 10", (t) => {
    const amount = -25;
    const interval = 10;
    const expected = amount / interval;

    let r = new Rate("test", amount, interval, it.IntervalType.Days);
    t.is(r.perDiem(moment()), expected);
});

ava.test("perDiem - day - 100", (t) => {
    const amount = -25;
    const interval = 100;
    const expected = amount / interval;

    let r = new Rate("test", amount, interval, it.IntervalType.Days);
    t.is(r.perDiem(moment()), expected);
});

ava.test("perDiem - month - feb2016", (t) => {
    const amount = -25;
    const month = moment([2016, 1, 1]); // months in moment are zero indexed
    const expected = amount / month.daysInMonth();

    let r = new Rate("test", amount, 1, it.IntervalType.Month);
    t.is(r.perDiem(month), expected);
});

ava.test("perDiem - month - feb2016 - interval", (t) => {
    const amount = -25;
    const month = moment([2016, 1, 1]);
    const expected = amount / month.daysInMonth();

    let r = new Rate("test", amount, 10, it.IntervalType.Month);
    t.is(r.perDiem(month), expected);
});

ava.test("perDiem - month - jan2016", (t) => {
    const amount = -25;
    const month = moment([2016, 0, 1]);
    const expected = amount / month.daysInMonth();

    let r = new Rate("test", amount, 1, it.IntervalType.Month);
    t.is(r.perDiem(month), expected);
});

ava.test("perDiem - month - april2016", (t) => {
    const amount = -25;
    const month = moment([2016, 3, 1]);
    const expected = amount / month.daysInMonth();

    let r = new Rate("test", amount, 1, it.IntervalType.Month);
    t.is(r.perDiem(month), expected);
});

ava.test("perDiem - year - non leap", (t) => {
    const amount = -25;
    const year = moment([2015, 1, 1]);
    const expected = amount / 365;

    let r = new Rate("test", amount, 1, it.IntervalType.Year);
    t.is(r.perDiem(year), expected);
});

ava.test("perDiem - year - leap", (t) => {
    const amount = -25;
    const year = moment([2016, 1, 1]);
    const expected = amount / 366;

    let r = new Rate("test", amount, 1, it.IntervalType.Year);
    t.is(r.perDiem(year), expected);
});

ava.test("toJSON", (t) => {

    const name = "test";
    const amount = -124;
    const interval = 30;
    const intervalType = it.IntervalType.Days;
    const start = moment();
    const end = moment();

    let r = new Rate(name, amount, interval, intervalType, start, end);
    r.id(1);
    t.same(r.toJSON(), {
        id: 1,
        name: name,
        amount: amount,
        interval: interval,
        intervalType: intervalType,
        startDate: start,
        endDate: end
    });
});

ava.test("toJSON - null start/end", (t) => {

    const name = "test";
    const amount = -124;
    const interval = 30;
    const intervalType = it.IntervalType.Days;

    let r = new Rate(name, amount, interval, intervalType);
    r.id(1);
    t.same(r.toJSON(), {
        id: 1,
        name: name,
        amount: amount,
        interval: interval,
        intervalType: intervalType,
        startDate: undefined,
        endDate: undefined
    });
});

ava.test("clone", (t) => {
    let rOne = new Rate("One", -25, 1, it.IntervalType.Days, moment(), moment());
    rOne.id(1);
    let rTwo = rOne.clone();

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

ava.test("update", (t) => {
    const name1 = "One";
    const amount1 = -25;
    const interval1 = 1;

    const intervalType = it.IntervalType.Days;

    const name2 = "One.1";
    const amount2 = -30;
    const interval2 = 5;

    let rOne = new Rate(name1, amount1, interval1, intervalType);
    rOne.id(1);
    let modified = new Rate(name2, amount2, interval2, intervalType);
    modified.id(2);

    rOne.update(modified);

    t.is(rOne.id(), 1);
    t.is(rOne.name(), name2);
    t.is(rOne.amount(), amount2);
    t.is(rOne.interval(), interval2);
});

ava.test("update - with start/end", (t) => {
    const name1 = "One";
    const amount1 = -25;
    const interval1 = 1;
    const start1 = moment([2016, 1, 10]);
    const end1 = moment([2016, 2, 1]);

    const intervalType = it.IntervalType.Days;

    const name2 = "One.1";
    const amount2 = -30;
    const interval2 = 5;
    const start2 = moment([2016, 2, 10]);
    const end2 = moment([2016, 3, 1]);

    let rOne = new Rate(name1, amount1, interval1, intervalType, start1, end1);
    rOne.id(1);
    let modified = new Rate(name2, amount2, interval2, intervalType, start2, end2);
    modified.id(2);

    rOne.update(modified);

    t.is(rOne.id(), 1);
    t.is(rOne.name(), name2);
    t.is(rOne.amount(), amount2);
    t.is(rOne.interval(), interval2);
    t.true(rOne.startDate().isSame(start2));
    t.true(rOne.endDate().isSame(end2));
});

ava.test("update - add start/end", (t) => {
    const name1 = "One";
    const amount1 = -25;
    const interval1 = 1;

    const intervalType = it.IntervalType.Days;

    const name2 = "One.1";
    const amount2 = -30;
    const interval2 = 5;
    const start2 = moment([2016, 2, 10]);
    const end2 = moment([2016, 3, 1]);

    let rOne = new Rate(name1, amount1, interval1, intervalType);
    rOne.id(1);
    let modified = new Rate(name2, amount2, interval2, intervalType, start2, end2);
    modified.id(2);

    rOne.update(modified);

    t.is(rOne.id(), 1);
    t.is(rOne.name(), name2);
    t.is(rOne.amount(), amount2);
    t.is(rOne.interval(), interval2);
    t.is(rOne.startDate().isSame(start2), true);
    t.is(rOne.endDate().isSame(end2), true);
});