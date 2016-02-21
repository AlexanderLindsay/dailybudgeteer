namespace RateWidget {
    "use strict";

    class RateDataSource implements Components.DataSource<Rate> {
        item: _mithril.MithrilProperty<Rate>;

        constructor(private context: Data.Context) {
            this.item = m.prop(new Rate("", 0, 0));
        }

        list = () => {
            let deferred = m.deferred<Rate[]>();
            deferred.resolve(this.context.listRates());
            return deferred.promise;
        };

        public total = () => {
            let t = 0;
            this.context.listRates()
                .forEach((rate: Rate, index: number) => {
                    t += rate.perDiem();
                });
            return t;
        };

        public edit = (id: number) => {
            let rate = this.context.getRate(id);
            if (rate === null) {
                this.item(new Rate("", 0, 0));
            } else {
                this.item(rate);
            }
        };

        public remove = (id: number) => {
            this.context.removeRate(id);
        };

        public save = () => {
            if (this.item().id() === 0) {
                this.context.addRate(this.item());
            }

            this.item(new Rate("", 0, 0));
        };
    }

    export class RateWidgetController implements _mithril.MithrilController {

        public source: RateDataSource;

        constructor(context: Data.Context) {
            this.source = new RateDataSource(context);
        }
    }
}