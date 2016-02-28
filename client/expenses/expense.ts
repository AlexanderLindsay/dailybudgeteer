/// <reference path="../../typings/browser.d.ts" />

import moment = require("moment");
import IKeyed from "../data/keyed";

export default class Expense implements IKeyed {
    id: _mithril.MithrilProperty<number>;
    name: _mithril.MithrilProperty<string>;
    day: _mithril.MithrilProperty<moment.Moment>;
    amount: _mithril.MithrilProperty<number>;

    constructor(name: string, day: moment.Moment, amount: number) {
        this.id = m.prop(0);
        this.name = m.prop(name);
        this.day = m.prop(day);
        this.amount = m.prop(amount);
    }

    public setDay = (value: string) => {
        let day = moment(value, "YYYY-MM-DD");
        this.day(day);
    };

    public getDay = () => {
        const day = this.day();
        if (day == null) {
            return "";
        }

        return day.format("YYYY-MM-DD");
    };

    public toJSON = () => {
        return {
            id: this.id(),
            name: this.name(),
            day: this.day(),
            amount: this.amount()
        };
    };
}
