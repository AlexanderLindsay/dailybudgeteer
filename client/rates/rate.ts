/// <reference path="../../typings/browser.d.ts" />

import IKeyed from "../data/keyed";
import * as it from "./intervaltype";

export default class Rate implements IKeyed {

    public id: _mithril.MithrilProperty<number>;
    public name: _mithril.MithrilProperty<string>;
    public amount: _mithril.MithrilProperty<number>;
    public interval: _mithril.MithrilProperty<number>;
    public intervalType: _mithril.MithrilProperty<it.IntervalType>;

    private static calculatePerDiem(amount: number, days: number) {
        if (days <= 0) {
            return 0;
        }

        return amount / days;
    }

    public perDiem = (onDate: Date) => {
        const year = onDate.getFullYear();
        const month = onDate.getMonth();

        switch (this.intervalType()) {
            case it.IntervalType.Days:
                return Rate.calculatePerDiem(this.amount(), this.interval());
            case it.IntervalType.Month:
                const monthStart = new Date(year, month, 1);
                const monthEnd = new Date(year, month + 1, 1);
                const monthLengthMilliseconds = monthEnd.valueOf() - monthStart.valueOf();

                // 1000 milliseconds in a second
                // 60 seconds in a minute
                // 60 minutes in an hour
                // 24 hours in a day
                const monthLengthDays = monthLengthMilliseconds / (1000 * 60 * 60 * 24);
                return Rate.calculatePerDiem(this.amount(), monthLengthDays);
            case it.IntervalType.Year:
                const isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);

                return Rate.calculatePerDiem(this.amount(), isLeapYear ? 366 : 365);
        }
    };

    public allowInterval() {
        return this.intervalType() === it.IntervalType.Days;
    }

    public startDate: _mithril.MithrilProperty<Date>;
    public endDate: _mithril.MithrilProperty<Date>;

    constructor(name: string, amount: number, interval: number, intervalType: it.IntervalType, start?: Date, end?: Date) {
        this.id = m.prop(0);
        this.name = m.prop(name);
        this.amount = m.prop(amount);
        this.interval = m.prop(interval);
        this.intervalType = m.prop(intervalType);
        this.startDate = m.prop(start);
        this.endDate = m.prop(end);
    }

    public toJSON = () => {
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
}
