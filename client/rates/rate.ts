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

        constructor(name: string, amount: number, days: number) {
            this.id = m.prop(0);
            this.name = m.prop(name);
            this.amount = m.prop(amount);
            this.days = m.prop(days);

            this.startDate = m.prop(<Date>null);
            this.endDate = m.prop(<Date>null);
        }
    }
}