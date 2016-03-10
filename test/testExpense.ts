import * as ava from "ava";
import * as moment from "moment";
import Expense from "../client/expenses/expense";

ava.test("set day", (t) => {
    const start = moment();
    let e = new Expense("test", start, -200);

    t.true(e.day().isSame(start));

    const newDateValue = "2016-02-29";
    e.setDay(newDateValue);
    t.true(e.day().isSame(newDateValue));
});

ava.test("set day - invalid", (t) => {
    const start = moment();
    let e = new Expense("test", start, -200);

    t.true(e.day().isSame(start));

    e.setDay("2016-02-31");
    t.true(e.day().isSame(start));
});

ava.test("set day - multiple", (t) => {
    const start = moment();
    let e = new Expense("test", start, -200);

    t.true(e.day().isSame(start));

    const newDateValue = "2016-01-15";
    e.setDay(newDateValue);
    t.true(e.day().isSame(newDateValue));

    const anotherNewDateValue = "2015-10-15";
    e.setDay(anotherNewDateValue);
    t.true(e.day().isSame(anotherNewDateValue));
});

ava.test("get day", (t) => {
    const start = moment([2016, 0, 15]); // months in moment are zero indexed
    let e = new Expense("test", start, -200);

    t.is(e.getDay(), "2016-01-15");
});

ava.test("get day - after set", (t) => {
    const start = moment([2016, 0, 15]);
    let e = new Expense("test", start, -200);

    const newDateValue = "2015-05-07";
    e.setDay(newDateValue);

    t.is(e.getDay(), newDateValue);
});

ava.test("get day - invalid", (t) => {
    const start = moment.invalid();
    let e = new Expense("test", start, -200);

    t.is(e.getDay(), "");
});

ava.test("toJSON", (t) => {
    const id = 1;
    const name = "test";
    const day = moment([2016, 0, 20]);
    const amount = -200;

    let e = new Expense(name, day, amount);
    e.id(id);

    t.same(e.toJSON(), {
        id: id,
        name: name,
        day: day,
        amount: amount
    });
});

ava.test("clone", (t) => {
    let eOne = new Expense("One", moment([2016, 0, 20]), -200);
    eOne.id(1);
    let clone = eOne.clone();

    t.is(eOne.id(), clone.id());
    t.is(eOne.name(), clone.name());
    t.true(eOne.day().isSame(clone.day()));
    t.is(eOne.amount(), clone.amount());

    clone.name("Two");
    t.is(clone.name(), "Two");
    t.is(eOne.name(), "One");

    clone.day().add(1, "day");
    t.false(eOne.day().isSame(clone.day()));

    const newDateValue = "2015-03-04";
    clone.setDay(newDateValue);
    t.true(clone.day().isSame(newDateValue));
    t.false(eOne.day().isSame(newDateValue));
});

ava.test("update", (t) => {
    const nameOne = "One";
    const dayOne = moment([2016, 0, 1]);
    const amountOne = -200;

    let eOne = new Expense(nameOne, dayOne, amountOne);
    eOne.id(1);

    const nameTwo = "Two";
    const dayTwo = moment([2016, 1, 1]);
    const amountTwo = -250;

    let eTwo = new Expense(nameTwo, dayTwo, amountTwo);
    eTwo.id(2);

    eOne.update(eTwo);

    t.is(eOne.id(), 1);
    t.is(eOne.name(), nameTwo);
    t.true(eOne.day().isSame(dayTwo));
    t.is(eOne.amount(), amountTwo);
});