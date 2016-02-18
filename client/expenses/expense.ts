/// <reference path="../../typings/browser.d.ts" />

module expenseWidget {
    "use strict";
    
    export class expense {
        id: _mithril.MithrilBasicProperty<number>;
        day: _mithril.MithrilBasicProperty<Date>;
        amount: _mithril.MithrilBasicProperty<number>;
        
        constructor(day: Date, amount: number) {
            this.id = m.prop(0);
            this.day = m.prop(day);
            this.amount = m.prop(amount);
        }
    }
}