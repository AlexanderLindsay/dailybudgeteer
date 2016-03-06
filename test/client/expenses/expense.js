/// <reference path="../../typings/browser.d.ts" />
"use strict";
const m = require("mithril");
const moment = require("moment");
class Expense {
    constructor(name, day, amount) {
        this.setDay = (value) => {
            let day = moment(value, "YYYY-MM-DD");
            this.day(day);
        };
        this.getDay = () => {
            const day = this.day();
            if (day == null) {
                return "";
            }
            return day.format("YYYY-MM-DD");
        };
        this.toJSON = () => {
            return {
                id: this.id(),
                name: this.name(),
                day: this.day(),
                amount: this.amount()
            };
        };
        this.clone = () => {
            let clone = new Expense(this.name(), this.day(), this.amount());
            clone.id(this.id());
            return clone;
        };
        this.update = (modified) => {
            this.name(modified.name());
            this.day(modified.day());
            this.amount(modified.amount());
        };
        this.id = m.prop(0);
        this.name = m.prop(name);
        this.day = m.prop(day);
        this.amount = m.prop(amount);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Expense;
//# sourceMappingURL=expense.js.map