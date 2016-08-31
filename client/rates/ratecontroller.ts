/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
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
    isAddModalOpen: _mithril.MithrilProperty<boolean>;
    modalTitle: _mithril.MithrilProperty<string>;
    modalActionName: _mithril.MithrilProperty<string>;
    editDates: _mithril.MithrilProperty<boolean>;

    constructor(private context: BudgetContext, public day: moment.Moment) {
        this.item = m.prop(new Rate("", 0, 1, it.IntervalType.Days));
        this.isAddModalOpen = m.prop(false);
        this.modalTitle = m.prop(saveTitle);
        this.modalActionName = m.prop(saveActionName);
        this.editDates = m.prop(false);
        this.list = this.fetchList();
        context.addUpdateCallback(this.contextCallback);
    }

    private contextCallback = () => {
        this.list = this.fetchList();
    };

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    };

    private fetchList = () => {
        let deferred = m.deferred<Rate[]>();
        deferred.resolve(this.context.listActiveRates(this.day));
        return deferred.promise;
    };

    public total = () => {
        let t = 0;
        this.list()
            .forEach((rate: Rate, index: number) => {
                t += rate.perDiem(this.day);
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
        this.editDates(false);
        this.isAddModalOpen(true);
    };

    public remove = (id: number) => {
        this.context.removeRate(id);
    };

    public expire = () => {
        if (this.item().id() > 0) {
            let current = this.context.getRate(this.item().id());
            current.expireOn(this.day);
        }
    };

    public editDuration = () => {
        this.editDates(true);
    };

    public save = () => {
        if (this.item().intervalType() !== it.IntervalType.Days) {
            this.item().interval(1);
        }

        if (this.item().id() === 0) {
            if (this.item().startDate() === undefined) {
                this.item().startDate(this.day);
            }
            this.context.addRate(this.item());
        } else {
            let modified = this.item();
            let current = this.context.getRate(modified.id());
            current.update(modified);
        }
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
        this.editDates(false);
        this.isAddModalOpen(true);
    };
}

export class RateController implements _mithril.MithrilController {

    public vm: RateDataSource;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.vm = new RateDataSource(context, day);
    }
}