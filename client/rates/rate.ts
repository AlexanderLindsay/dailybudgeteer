/// <reference path="../../typings/browser.d.ts" />

import moment = require("moment");
import IKeyed from "../data/keyed";
import * as it from "./intervaltype";

export default class Rate implements IKeyed {

    public id: _mithril.MithrilProperty<number>;
    public name: _mithril.MithrilProperty<string>;
    public amount: _mithril.MithrilProperty<number>;
    public interval: _mithril.MithrilProperty<number>;
    public intervalType: _mithril.MithrilProperty<it.IntervalType>;

    public startDate: _mithril.MithrilProperty<moment.Moment>;
    public endDate: _mithril.MithrilProperty<moment.Moment>;

    constructor(name: string, amount: number, interval: number, intervalType: it.IntervalType, start?: moment.Moment, end?: moment.Moment) {
        this.id = m.prop(0);
        this.name = m.prop(name);
        this.amount = m.prop(amount);
        this.interval = m.prop(interval);
        this.intervalType = m.prop(intervalType);
        this.startDate = m.prop(start);
        this.endDate = m.prop(end);
    }

    private static calculatePerDiem(amount: number, days: number) {
        if (days <= 0) {
            return 0;
        }

        return amount / days;
    }

    public perDiem = (onDate: moment.Moment) => {
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

    public allowInterval() {
        return this.intervalType() === it.IntervalType.Days;
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

    public clone = () => {
        let clone = new Rate(this.name(), this.amount(), this.interval(),
            this.intervalType(), this.startDate(), this.endDate());
        clone.id(this.id());
        return clone;
    };

    public update = (modified: Rate) => {
        this.name(modified.name());
        this.amount(modified.amount());
        this.interval(modified.interval());
        this.intervalType(modified.intervalType());
        this.startDate(modified.startDate());
        this.endDate(modified.endDate());
    };
}
