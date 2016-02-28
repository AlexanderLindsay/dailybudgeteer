import * as it from "./intervaltype";
import Rate from "./rate";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import DataSource from "../components/datasource";

class RateDataSource implements DataSource<Rate> {
    item: _mithril.MithrilProperty<Rate>;

    constructor(private context: BudgetContext) {
        this.item = m.prop(new Rate("", 0, 1, it.IntervalType.Days));
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
            this.item(new Rate("", 0, 1, it.IntervalType.Days));
        } else {
            this.item(rate);
        }
    };

    public remove = (id: number) => {
        this.context.removeRate(id);
    };

    public save = () => {
        if (this.item().id() === 0) {
            if (this.item().intervalType() !== it.IntervalType.Days) {
                this.item().interval(1);
            }
            this.item().startDate(new Date());
            this.context.addRate(this.item());
        }

        this.item(new Rate("", 0, 1, it.IntervalType.Days));
    };
}

export default class RateWidgetController implements _mithril.MithrilController {

    public source: RateDataSource;

    constructor(context: BudgetContext) {
        this.source = new RateDataSource(context);
    }
}