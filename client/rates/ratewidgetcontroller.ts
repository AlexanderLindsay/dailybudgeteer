module RateWidget {
    "use strict";

    export class RateWidgetController implements _mithril.MithrilController {

        private nextId: number;
        public rates: Rate[];
        public rate: _mithril.MithrilProperty<Rate>;

        constructor() {
            this.nextId = 1;
            this.rates = [];
            this.rate = m.prop(new Rate("", 0, 0));
        }

        public save = () => {
            var rate = this.rate();
            
            if (rate.id() == 0) {
                rate.id(this.nextId)
                this.nextId += 1;
                this.rates.push(rate);
            }
            
            this.rate(new Rate("", 0, 0))
        }

        public remove = (index: number) => {
            this.rates.splice(index, 1);
        }

        public edit = (index: number) => {
            if (index < 0 || index > this.rates.length) {
                this.rate(new Rate("", 0, 0));
            }
            this.rate(this.rates[index]);
        }
    }
}