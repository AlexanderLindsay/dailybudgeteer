import * as m from "mithril";
import * as prop from "mithril/stream";
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

export default class RatesController implements DataSource<Rate> {
    item: prop.Stream<Rate>;
    list: prop.Stream<Rate[]>;
    isAddModalOpen: prop.Stream<boolean>;
    modalTitle: prop.Stream<string>;
    modalActionName: prop.Stream<string>;
    editDates: prop.Stream<boolean>;
    day: prop.Stream<moment.Moment>;

    constructor(private context: BudgetContext) {
        this.day = prop(moment());
        this.item = prop(new Rate("", 0, 1, it.IntervalType.Days));
        this.isAddModalOpen = prop(false);
        this.modalTitle = prop(saveTitle);
        this.modalActionName = prop(saveActionName);
        this.editDates = prop(false);
        this.list = prop([]);
        context.addUpdateCallback(this.contextCallback);
        this.fetchList();
    }

    private contextCallback = () => {
        this.fetchList();
    }

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    }

    private fetchList = () => {
        this.list(this.context.listActiveRates(this.day()));
    }

    public total = () => {
        let t = 0;
        this.list()
            .forEach((rate: Rate, index: number) => {
                t += rate.perDiem(this.day());
            });
        return t;
    }

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
    }

    public remove = (id: number) => {
        this.context.removeRate(id);
    }

    public expire = () => {
        if (this.item().id() > 0) {
            let current = this.context.getRate(this.item().id());
            current.expireOn(this.day());
        }
    }

    public editDuration = () => {
        this.editDates(true);
    }

    public save = () => {
        if (this.item().intervalType() !== it.IntervalType.Days) {
            this.item().interval(1);
        }

        if (this.item().id() === 0) {
            if (this.item().startDate() === undefined) {
                this.item().startDate(this.day());
            }
            this.context.addRate(this.item());
        } else {
            let modified = this.item();
            let current = this.context.getRate(modified.id());
            current.update(modified);
        }
    }

    public allowEdit = (id: number) => {
        return true;
    }

    public allowRemove = (id: number) => {
        return true;
    }

    public openAddModal = () => {
        this.item(new Rate("", 0, 1, it.IntervalType.Days));
        this.modalTitle(saveTitle);
        this.modalActionName(saveActionName);
        this.editDates(false);
        this.isAddModalOpen(true);
    }
}