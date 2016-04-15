import * as ava from "ava";
import * as moment from "moment";
import Expense from "../client/expenses/expense";

ava.test("toJSON", (t) => {
    const id = 1;
    const name = "test";
    const day = moment([2016, 0, 20]);
    const amount = -200;
    const category = 1;

    let e = new Expense(name, day, amount);
    e.id(id);
    e.category(category);

    t.same(e.toJSON(), {
        id: id,
        name: name,
        day: day,
        amount: amount,
        category: category
    });
});

ava.test("clone", (t) => {
    let eOne = new Expense("One", moment([2016, 0, 20]), -200);
    eOne.id(1);
    eOne.category(1);
    let clone = eOne.clone();

    t.is(eOne.id(), clone.id());
    t.is(eOne.name(), clone.name());
    t.true(eOne.day().isSame(clone.day()));
    t.is(eOne.amount(), clone.amount());
    t.is(eOne.category(), clone.category());

    clone.name("Two");
    t.is(clone.name(), "Two");
    t.is(eOne.name(), "One");

    clone.day().add(1, "day");
    t.false(eOne.day().isSame(clone.day()));

    const newDateValue = "2015-03-04";
    clone.day(moment(newDateValue));
    t.true(clone.day().isSame(newDateValue));
    t.false(eOne.day().isSame(newDateValue));
});

ava.test("update", (t) => {
    const nameOne = "One";
    const dayOne = moment([2016, 0, 1]);
    const amountOne = -200;
    const categoryOne = 1;

    let eOne = new Expense(nameOne, dayOne, amountOne);
    eOne.id(1);
    eOne.category(categoryOne);

    const nameTwo = "Two";
    const dayTwo = moment([2016, 1, 1]);
    const amountTwo = -250;
    const categoryTwo = 2;

    let eTwo = new Expense(nameTwo, dayTwo, amountTwo);
    eTwo.id(2);
    eTwo.category(categoryTwo);

    eOne.update(eTwo);

    t.is(eOne.id(), 1);
    t.is(eOne.name(), nameTwo);
    t.true(eOne.day().isSame(dayTwo));
    t.is(eOne.amount(), amountTwo);
    t.is(eOne.category(), categoryTwo);
});