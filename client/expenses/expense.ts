/// <reference path="../../typings/browser.d.ts" />

module ExpenseWidget {
    "use strict";
    
    export class Expense {
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
    }
}