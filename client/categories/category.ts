/// <reference types="Mithril" />

import m = require("mithril");
import prop = require("mithril/stream");
import IKeyed from "../data/keyed";

export default class Category implements IKeyed {

    public id: prop.Stream<number>;
    public name: prop.Stream<string>;
    public description: prop.Stream<string>;

    constructor() {
        this.id = prop(0);
        this.name = prop("");
        this.description = prop("");
    }

    public toJSON = () => {
        return {
            id: this.id(),
            name: this.name(),
            description: this.description()
        };
    }

    public clone = () => {
        let clone = new Category();
        clone.id(this.id());
        clone.name(this.name());
        clone.description(this.description());
        return clone;
    }

    public update = (modified: Category) => {
        this.name(modified.name());
        this.description(modified.description());
    }
}