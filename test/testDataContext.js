define(["require", "exports", "ava", "mithril", "../client/data/datacontext"], function (require, exports, ava, m, datacontext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TestClass = (function () {
        function TestClass(id) {
            if (id === void 0) { id = 0; }
            this.id = m.prop(id);
        }
        return TestClass;
    }());
    ava.test("addItem", function (t) {
        var dc = new datacontext_1.default();
        var list = [];
        var item = new TestClass();
        var result = dc.addItem(item, list, 1);
        t.is(list.length, 1);
        t.is(result, 2);
        t.is(list[0].id(), 1);
    });
    ava.test("getItem", function (t) {
        var list = [
            new TestClass(1),
            new TestClass(2),
            new TestClass(3)
        ];
        var dc = new datacontext_1.default();
        var resultNull = dc.getItem(0, list);
        t.is(resultNull, null);
        var resultOne = dc.getItem(1, list);
        t.is(resultOne.id(), 1);
        var resultTwo = dc.getItem(2, list);
        t.is(resultTwo.id(), 2);
        var resultThree = dc.getItem(3, list);
        t.is(resultThree.id(), 3);
        var resultOneRepeat = dc.getItem(1, list);
        t.is(resultOneRepeat.id(), 1);
    });
    ava.test("getItem - Duplicate", function (t) {
        var list = [
            new TestClass(1),
            new TestClass(2),
            new TestClass(3),
            new TestClass(2)
        ];
        var dc = new datacontext_1.default();
        try {
            var result = dc.getItem(2, list);
        }
        catch (error) {
            t.is(error, "Duplicate id found");
        }
    });
    ava.test("getItem - empty list", function (t) {
        var list = [];
        var dc = new datacontext_1.default();
        var resultNull = dc.getItem(5, list);
        t.is(resultNull, null);
    });
    ava.test("removeItem", function (t) {
        var list = [
            new TestClass(1),
            new TestClass(2),
            new TestClass(3),
            new TestClass(10),
            new TestClass(50),
            new TestClass(6),
            new TestClass(5)
        ];
        var dc = new datacontext_1.default();
        list = dc.removeItem(5, list);
        t.is(list.length, 6);
        list = dc.removeItem(1, list);
        t.is(list.length, 5);
        t.is(list[0].id(), 2);
        list = dc.removeItem(10, list);
        t.is(list.length, 4);
        t.is(list[2].id(), 50);
    });
});
//# sourceMappingURL=testDataContext.js.map