define(["require", "exports", "ava", "../client/categories/category"], function (require, exports, ava, category_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ava.test("toJSON", function (t) {
        var id = 1;
        var name = "test";
        var description = "test description";
        var c = new category_1.default();
        c.id(id);
        c.name(name);
        c.description(description);
        t.deepEqual(c.toJSON(), {
            id: id,
            name: name,
            description: description
        });
    });
    ava.test("clone", function (t) {
        var cOne = new category_1.default();
        cOne.id(1);
        cOne.name("One");
        cOne.description("One");
        var clone = cOne.clone();
        t.is(cOne.id(), clone.id());
        t.is(cOne.name(), clone.name());
        t.is(cOne.description(), clone.description());
        clone.name("Two");
        t.is(clone.name(), "Two");
        t.is(cOne.name(), "One");
        clone.description("Two");
        t.is(clone.description(), "Two");
        t.is(cOne.description(), "One");
    });
    ava.test("update", function (t) {
        var nameOne = "One";
        var descriptionOne = "desc One";
        var cOne = new category_1.default();
        cOne.id(1);
        cOne.name(nameOne);
        cOne.description(descriptionOne);
        var nameTwo = "Two";
        var descriptionTwo = "desc Two";
        var cTwo = new category_1.default();
        cTwo.id(2);
        cTwo.name(nameTwo);
        cTwo.description(descriptionTwo);
        cOne.update(cTwo);
        t.is(cOne.id(), 1);
        t.is(cOne.name(), nameTwo);
        t.is(cOne.description(), descriptionTwo);
    });
});
//# sourceMappingURL=testCategory.js.map