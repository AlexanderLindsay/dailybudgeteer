import * as ava from "ava";
import Category from "../client/categories/category";

ava.test("toJSON", (t) => {
    const id = 1;
    const name = "test";
    const description = "test description";

    let c = new Category();
    c.id(id);
    c.name(name);
    c.description(description);

    t.deepEqual(c.toJSON(), {
        id: id,
        name: name,
        description: description
    });
});

ava.test("clone", (t) => {
    let cOne = new Category();
    cOne.id(1);
    cOne.name("One");
    cOne.description("One");

    let clone = cOne.clone();

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

ava.test("update", (t) => {
    const nameOne = "One";
    const descriptionOne = "desc One";

    let cOne = new Category();
    cOne.id(1);
    cOne.name(nameOne);
    cOne.description(descriptionOne);

    const nameTwo = "Two";
    const descriptionTwo = "desc Two";

    let cTwo = new Category();
    cTwo.id(2);
    cTwo.name(nameTwo);
    cTwo.description(descriptionTwo);

    cOne.update(cTwo);

    t.is(cOne.id(), 1);
    t.is(cOne.name(), nameTwo);
    t.is(cOne.description(), descriptionTwo);
});