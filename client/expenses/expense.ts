/// <reference path="../../typings/browser.d.ts" />

module ExpenseWidget {
    "use strict";
    
    export class Expense {
        id: _mithril.MithrilBasicProperty<number>;
        name: _mithril.MithrilBasicProperty<string>;
        day: _mithril.MithrilBasicProperty<Date>;
        amount: _mithril.MithrilBasicProperty<number>;
        
        constructor(name: string, day: Date, amount: number) {
            this.id = m.prop(0);
            this.name = m.prop(name);
            this.day = m.prop(day);
            this.amount = m.prop(amount);
        }
    }
}