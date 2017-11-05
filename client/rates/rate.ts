import m = require("mithril");
import prop = require("mithril/stream");
import moment = require("moment");
import IKeyed from "../data/keyed";
import * as it from "./intervaltype";

export default class Rate implements IKeyed {

    public id: prop.Stream<number>;
    public name: prop.Stream<string>;
    public amount: prop.Stream<number>;
    public interval: prop.Stream<number>;
    public intervalType: prop.Stream<it.IntervalType>;

    public startDate: prop.Stream<moment.Moment>;
    public endDate: prop.Stream<moment.Moment>;

    constructor(name: string, amount: number, interval: number, intervalType: it.IntervalType, start?: moment.Moment, end?: moment.Moment) {
        this.id = prop(0);
        this.name = prop(name);
        this.amount = prop(amount);
        this.interval = prop(interval);
        this.intervalType = prop(intervalType);
        this.startDate = prop(start);
        this.endDate = prop(end);
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
    }

    public expireOn(date: moment.Moment) {
        this.endDate(date);
    }

    public allowInterval() {
        return this.intervalType() === it.IntervalType.Days;
    }

    public isActiveOn(day: moment.Moment) {
        if (this.startDate() == null) {
            return true;
        } else if (this.startDate().isSameOrBefore(day, "day")) {
            if (this.endDate() == null) {
                return true;
            } else {
                return this.endDate().isSameOrAfter(day, "day");
            }
        }
        return false;
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
    }

    public clone = () => {
        let start = this.startDate();
        let end = this.endDate();

        if (start != null) {
            start = start.clone();
        }

        if (end != null) {
            end = end.clone();
        }

        let clone = new Rate(this.name(), this.amount(), this.interval(),
            this.intervalType(), start, end);
        clone.id(this.id());
        return clone;
    }

    public update = (modified: Rate) => {
        this.name(modified.name());
        this.amount(modified.amount());
        this.interval(modified.interval());
        this.intervalType(modified.intervalType());
        this.startDate(modified.startDate());
        this.endDate(modified.endDate());
    }
}
