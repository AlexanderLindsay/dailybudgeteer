/// <reference path="../../typings/browser.d.ts" />

import m = require("mithril");
import IKeyed from "../data/keyed";

export default class Category implements IKeyed {

    public id: _mithril.MithrilProperty<number>;
    public name: _mithril.MithrilProperty<string>;
    public description: _mithril.MithrilProperty<string>;

    constructor() {
        this.id = m.prop(0);
        this.name = m.prop("");
        this.description = m.prop("");
    }

    public toJSON = () => {
        return {
            id: this.id(),
            name: this.name(),
            description: this.description()
        };
    };

    public clone = () => {
        let clone = new Category();
        clone.id(this.id());
        clone.name(this.name());
        clone.description(this.description());
        return clone;
    };

    public update = (modified: Category) => {
        this.name(modified.name());
        this.description(modified.description());
    };
}