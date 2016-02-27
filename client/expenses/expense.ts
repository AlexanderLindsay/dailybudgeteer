/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../data/keyed.ts" />

namespace ExpenseWidget {
    "use strict";

    export class Expense implements Data.IKeyed {
        id: _mithril.MithrilProperty<number>;
        name: _mithril.MithrilProperty<string>;
        day: _mithril.MithrilProperty<Date>;
        amount: _mithril.MithrilProperty<number>;

        constructor(name: string, day: Date, amount: number) {
            this.id = m.prop(0);
            this.name = m.prop(name);
            this.day = m.prop(day);
            this.amount = m.prop(amount);
        }

        public toJSON = () => {
            return {
                id: this.id(),
                name: this.name(),
                day: this.day(),
                amount: this.amount()
            };
        };
    }
}