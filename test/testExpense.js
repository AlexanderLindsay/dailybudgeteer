define(["require", "exports", "ava", "moment", "../client/expenses/expense", "../client/categories/category"], function (require, exports, ava, moment, expense_1, category_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava.test("toJSON", function (t) {
        var id = 1;
        var name = "test";
        var day = moment([2016, 0, 20]);
        var amount = -200;
        var catId = 1;
        var category = new category_1.default();
        category.id(catId);
        var e = new expense_1.default(name, day, amount);
        e.id(id);
        e.category(category);
        t.deepEqual(e.toJSON(), {
            id: id,
            name: name,
            day: day,
            amount: amount,
            category: catId
        });
    });
    ava.test("clone", function (t) {
        var oneCat = new category_1.default();
        oneCat.id(1);
        var eOne = new expense_1.default("One", moment([2016, 0, 20]), -200);
        eOne.id(1);
        eOne.category(oneCat);
        var clone = eOne.clone();
        t.is(eOne.id(), clone.id());
        t.is(eOne.name(), clone.name());
        t.true(eOne.day().isSame(clone.day()));
        t.is(eOne.amount(), clone.amount());
        t.is(eOne.category().id(), clone.category().id());
        clone.name("Two");
        t.is(clone.name(), "Two");
        t.is(eOne.name(), "One");
        clone.day().add(1, "day");
        t.false(eOne.day().isSame(clone.day()));
        var newDateValue = "2015-03-04";
        clone.day(moment(newDateValue));
        t.true(clone.day().isSame(newDateValue));
        t.false(eOne.day().isSame(newDateValue));
    });
    ava.test("update", function (t) {
        var nameOne = "One";
        var dayOne = moment([2016, 0, 1]);
        var amountOne = -200;
        var categoryOne = new category_1.default();
        categoryOne.id(1);
        var eOne = new expense_1.default(nameOne, dayOne, amountOne);
        eOne.id(1);
        eOne.category(categoryOne);
        var nameTwo = "Two";
        var dayTwo = moment([2016, 1, 1]);
        var amountTwo = -250;
        var categoryTwo = new category_1.default();
        categoryTwo.id(2);
        var eTwo = new expense_1.default(nameTwo, dayTwo, amountTwo);
        eTwo.id(2);
        eTwo.category(categoryTwo);
        eOne.update(eTwo);
        t.is(eOne.id(), 1);
        t.is(eOne.name(), nameTwo);
        t.true(eOne.day().isSame(dayTwo));
        t.is(eOne.amount(), amountTwo);
        t.is(eOne.category().id(), categoryTwo.id());
    });
});
//# sourceMappingURL=testExpense.js.map