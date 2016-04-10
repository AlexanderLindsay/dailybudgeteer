/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import IKeyed from "../data/keyed";
import Category from "../categories/category";

export default class Expense implements IKeyed {
    id: _mithril.MithrilProperty<number>;
    name: _mithril.MithrilProperty<string>;
    day: _mithril.MithrilProperty<moment.Moment>;
    amount: _mithril.MithrilProperty<number>;
    category: _mithril.MithrilProperty<number>;

    constructor(name: string, day: moment.Moment, amount: number) {
        this.id = m.prop(0);
        this.name = m.prop(name);
        this.day = m.prop(day);
        this.amount = m.prop(amount);
        this.category = m.prop<number>(null);
    }

    public toJSON = () => {
        return {
            id: this.id(),
            name: this.name(),
            day: this.day(),
            amount: this.amount(),
            category: this.category()
        };
    };

    public clone = () => {

        let currentDay = this.day();
        if (currentDay != null) {
            currentDay = currentDay.clone();
        }

        let clone = new Expense(this.name(), currentDay, this.amount());
        clone.id(this.id());
        clone.category(this.category());
        return clone;
    };

    public update = (modified: Expense) => {
        this.name(modified.name());
        this.day(modified.day());
        this.amount(modified.amount());
        this.category(modified.category());
    };
}
