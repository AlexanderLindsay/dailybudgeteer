import * as ava from "ava";
import * as m from "mithril";
import IKeyed from "../client/data/keyed";
import DataContext from "../client/data/datacontext";

class TestClass implements IKeyed {

    public id: _mithril.MithrilProperty<number>;

    constructor(id: number = 0) {
        this.id = m.prop(id);
    }
}

ava.test("addItem", (t) => {
    let dc = new DataContext();
    let list: TestClass[] = [];
    let item = new TestClass();

    let result = dc.addItem(item, list, 1);
    t.is(list.length, 1);
    t.is(result, 2);
    t.is(list[0].id(), 1);
});

ava.test("getItem", (t) => {
    let list: TestClass[] = [
        new TestClass(1),
        new TestClass(2),
        new TestClass(3)
    ];

    let dc = new DataContext();
    let resultNull = dc.getItem(0, list);

    t.is(resultNull, null);

    let resultOne = dc.getItem(1, list);
    t.is(resultOne.id(), 1);

    let resultTwo = dc.getItem(2, list);
    t.is(resultTwo.id(), 2);

    let resultThree = dc.getItem(3, list);
    t.is(resultThree.id(), 3);

    let resultOneRepeat = dc.getItem(1, list);
    t.is(resultOneRepeat.id(), 1);
});

ava.test("getItem - Duplicate", (t) => {
    let list: TestClass[] = [
        new TestClass(1),
        new TestClass(2),
        new TestClass(3),
        new TestClass(2)
    ];

    let dc = new DataContext();
    try {
        let result = dc.getItem(2, list);
    } catch (error) {
        t.is(error, "Duplicate id found");
    }
});

ava.test("getItem - empty list", (t) => {
    let list: TestClass[] = [];

    let dc = new DataContext();
    let resultNull = dc.getItem(5, list);

    t.is(resultNull, null);
});

ava.test("removeItem", (t) => {
    let list: TestClass[] = [
        new TestClass(1),
        new TestClass(2),
        new TestClass(3),
        new TestClass(10),
        new TestClass(50),
        new TestClass(6),
        new TestClass(5)
    ];

    let dc = new DataContext();

    list = dc.removeItem(5, list);
    t.is(list.length, 6);

    list = dc.removeItem(1, list);
    t.is(list.length, 5);
    t.is(list[0].id(), 2);

    list = dc.removeItem(10, list);
    t.is(list.length, 4);
    t.is(list[2].id(), 50);
});