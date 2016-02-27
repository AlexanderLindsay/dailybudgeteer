namespace RateWidget {
    "use strict";

    class RateDataSource implements Components.DataSource<Rate> {
        item: _mithril.MithrilProperty<Rate>;

        constructor(private context: Data.BudgetContext) {
            this.item = m.prop(new Rate("", 0, 1, IntervalType.Days));
        }

        list = () => {
            let deferred = m.deferred<Rate[]>();
            deferred.resolve(this.context.listRates().filter((rate) => {
                const currentDate = new Date();
                if (rate.startDate() == null) {
                    return true;
                } else if (rate.startDate() <= currentDate) {
                    if (rate.endDate() == null) {
                        return true;
                    } else {
                        return rate.endDate() >= currentDate;
                    }
                }
                return false;
            }));
            return deferred.promise;
        };

        public total = () => {
            let t = 0;
            this.context.listRates()
                .forEach((rate: Rate, index: number) => {
                    t += rate.perDiem(new Date());
                });
            return t;
        };

        public edit = (id: number) => {
            let rate = this.context.getRate(id);
            if (rate === null) {
                this.item(new Rate("", 0, 1, IntervalType.Days));
            } else {
                this.item(rate);
            }
        };

        public remove = (id: number) => {
            this.context.removeRate(id);
        };

        public save = () => {
            if (this.item().id() === 0) {
                if (this.item().intervalType() !== IntervalType.Days) {
                    this.item().interval(1);
                }
                this.item().startDate(new Date());
                this.context.addRate(this.item());
            }

            this.item(new Rate("", 0, 1, IntervalType.Days));
        };
    }

    export class RateWidgetController implements _mithril.MithrilController {

        public source: RateDataSource;

        constructor(context: Data.BudgetContext) {
            this.source = new RateDataSource(context);
        }
    }
}