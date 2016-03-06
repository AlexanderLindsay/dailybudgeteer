import m = require("mithril");
import moment = require("moment");
import * as it from "./intervaltype";
import Rate from "./rate";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import BudgetContext from "../data/budgetcontext";
import DataSource from "../components/datasource";

const saveTitle = "Add Rate";
const saveActionName = "Add";
const editTitle = "Edit Rate";
const editActionName = "Save";

export class RateDataSource implements DataSource<Rate> {
    item: _mithril.MithrilProperty<Rate>;
    list: _mithril.MithrilPromise<Rate[]>;
    isAddModalOpen: _mithril.MithrilProperty<Boolean>;
    modalTitle: _mithril.MithrilProperty<string>;
    modalActionName: _mithril.MithrilProperty<string>;

    constructor(private context: BudgetContext) {
        this.item = m.prop(new Rate("", 0, 1, it.IntervalType.Days));
        this.isAddModalOpen = m.prop(false);
        this.modalTitle = m.prop(saveTitle);
        this.modalActionName = m.prop(saveActionName);
        this.list = this.fetchList();
    }

    private fetchList = () => {
        let deferred = m.deferred<Rate[]>();
        deferred.resolve(this.context.listRates().filter((rate) => {
            const currentDate = moment();
            if (rate.startDate() == null) {
                return true;
            } else if (rate.startDate().isSameOrBefore(currentDate, "day")) {
                if (rate.endDate() == null) {
                    return true;
                } else {
                    return rate.endDate().isSameOrAfter(currentDate, "day");
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
                t += rate.perDiem(moment());
            });
        return t;
    };

    public edit = (id: number) => {
        let rate = this.context.getRate(id);
        if (rate === null) {
            this.item(new Rate("", 0, 1, it.IntervalType.Days));
        } else {
            this.item(rate.clone());
        }

        this.modalTitle(editTitle);
        this.modalActionName(editActionName);
        this.isAddModalOpen(true);
    };

    public remove = (id: number) => {
        this.context.removeRate(id);
        this.list = this.fetchList();
    };

    public save = () => {
        if (this.item().intervalType() !== it.IntervalType.Days) {
            this.item().interval(1);
        }

        if (this.item().id() === 0) {
            this.item().startDate(moment());
            this.context.addRate(this.item());
        } else {
            let modified = this.item();
            let current = this.context.getRate(modified.id());
            current.update(modified);
        }
        this.list = this.fetchList();
    };

    public allowEdit = (id: number) => {
        return true;
    };

    public allowRemove = (id: number) => {
        return true;
    };

    public openAddModal = () => {
        this.item(new Rate("", 0, 1, it.IntervalType.Days));
        this.modalTitle(saveTitle);
        this.modalActionName(saveActionName);
        this.isAddModalOpen(true);
    };
}

export class RateWidgetController implements _mithril.MithrilController {

    public vm: RateDataSource;

    constructor(context: BudgetContext) {
        this.vm = new RateDataSource(context);
    }
}