/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../data/keyed.ts" />

namespace RateWidget {
    "use strict";

    export class Rate implements Data.IKeyed {

        public id: _mithril.MithrilProperty<number>;
        public name: _mithril.MithrilProperty<string>;
        public amount: _mithril.MithrilProperty<number>;
        public days: _mithril.MithrilProperty<number>;

        public perDiem = () => {
            if (this.days() <= 0) {
                return 0;
            }

            return this.amount() / this.days();
        };

        public startDate: _mithril.MithrilProperty<Date>;
        public endDate: _mithril.MithrilProperty<Date>;

        constructor(name: string, amount: number, days: number, start?: Date, end?: Date) {
            this.id = m.prop(0);
            this.name = m.prop(name);
            this.amount = m.prop(amount);
            this.days = m.prop(days);

            this.startDate = m.prop(start);
            this.endDate = m.prop(end);
        }

        public toJSON = () => {
            return {
                id: this.id(),
                name: this.name(),
                amount: this.amount(),
                days: this.days(),
                startDate: this.startDate(),
                endDate: this.endDate()
            };
        };
    }
}