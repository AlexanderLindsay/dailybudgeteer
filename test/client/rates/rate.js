/// <reference path="../../typings/browser.d.ts" />
"use strict";
const m = require("mithril");
const it = require("./intervaltype");
class Rate {
    constructor(name, amount, interval, intervalType, start, end) {
        this.perDiem = (onDate) => {
            switch (this.intervalType()) {
                case it.IntervalType.Days:
                    return Rate.calculatePerDiem(this.amount(), this.interval());
                case it.IntervalType.Month:
                    return Rate.calculatePerDiem(this.amount(), onDate.daysInMonth());
                case it.IntervalType.Year:
                    const isLeapYear = onDate.isLeapYear();
                    return Rate.calculatePerDiem(this.amount(), isLeapYear ? 366 : 365);
            }
        };
        this.toJSON = () => {
            return {
                id: this.id(),
                name: this.name(),
                amount: this.amount(),
                interval: this.interval(),
                intervalType: this.intervalType(),
                startDate: this.startDate(),
                endDate: this.endDate()
            };
        };
        this.clone = () => {
            let clone = new Rate(this.name(), this.amount(), this.interval(), this.intervalType(), this.startDate(), this.endDate());
            clone.id(this.id());
            return clone;
        };
        this.update = (modified) => {
            this.name(modified.name());
            this.amount(modified.amount());
            this.interval(modified.interval());
            this.intervalType(modified.intervalType());
            this.startDate(modified.startDate());
            this.endDate(modified.endDate());
        };
        this.id = m.prop(0);
        this.name = m.prop(name);
        this.amount = m.prop(amount);
        this.interval = m.prop(interval);
        this.intervalType = m.prop(intervalType);
        this.startDate = m.prop(start);
        this.endDate = m.prop(end);
    }
    static calculatePerDiem(amount, days) {
        if (days <= 0) {
            return 0;
        }
        return amount / days;
    }
    allowInterval() {
        return this.intervalType() === it.IntervalType.Days;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rate;
//# sourceMappingURL=rate.js.map