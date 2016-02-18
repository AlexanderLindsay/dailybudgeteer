/// <reference path="../../typings/browser.d.ts" />

module RateWidget {
    "use strict";
    
    export class Rate {
        
        public id: _mithril.MithrilBasicProperty<number>;
        public name: _mithril.MithrilBasicProperty<string>;
        public amount: _mithril.MithrilBasicProperty<number>;
        public days: _mithril.MithrilBasicProperty<number>;
        
        public perDiem = () => {
            if(this.days() <= 0)
            {
                return 0;
            }
            
            return this.amount() / this.days();
        }
        
        public startDate: _mithril.MithrilBasicProperty<Date>;
        public endDate: _mithril.MithrilBasicProperty<Date>;
               
        constructor(name: string, amount: number, days: number){
            this.id = m.prop(0);
            this.name = m.prop(name);
            this.amount = m.prop(amount);
            this.days = m.prop(days);
            
            this.startDate = m.prop(<Date>null);
            this.endDate = m.prop(<Date>null);
        }
    }
}