/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../data/keyed.ts" />

namespace RateWidget {
    "use strict";

    export enum IntervalType {
        Days,
        Month,
        Year
    }

    export class Rate implements Data.IKeyed {

        public id: _mithril.MithrilProperty<number>;
        public name: _mithril.MithrilProperty<string>;
        public amount: _mithril.MithrilProperty<number>;
        public interval: _mithril.MithrilProperty<number>;
        public intervalType: _mithril.MithrilProperty<IntervalType>;

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
                case IntervalType.Days:
                    return Rate.calculatePerDiem(this.amount(), this.interval());
                case IntervalType.Month:
                    const monthStart = new Date(year, month, 1);
                    const monthEnd = new Date(year, month + 1, 1);
                    const monthLengthMilliseconds = monthEnd.valueOf() - monthStart.valueOf();

                    // 1000 milliseconds in a second
                    // 60 seconds in a minute
                    // 60 minutes in an hour
                    // 24 hours in a day
                    const monthLengthDays = monthLengthMilliseconds / (1000 * 60 * 60 * 24);
                    return Rate.calculatePerDiem(this.amount(), monthLengthDays);
                case IntervalType.Year:
                    const isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);

                    return Rate.calculatePerDiem(this.amount(), isLeapYear ? 366 : 365);
            }
        };

        public allowInterval() {
            return this.intervalType() === IntervalType.Days;
        }

        public startDate: _mithril.MithrilProperty<Date>;
        public endDate: _mithril.MithrilProperty<Date>;

        constructor(name: string, amount: number, interval: number, intervalType: IntervalType, start?: Date, end?: Date) {
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
}