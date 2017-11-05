import * as m from "mithril";
import * as prop from "mithril/stream";
import * as moment from "moment";
import IKeyed from "../data/keyed";
import Category from "../categories/category";

export default class Expense implements IKeyed {
    id: prop.Stream<number>;
    name: prop.Stream<string>;
    day: prop.Stream<moment.Moment>;
    amount: prop.Stream<number>;
    category: prop.Stream<Category>;

    constructor(name: string, day: moment.Moment, amount: number) {
        this.id = prop(0);
        this.name = prop(name);
        this.day = prop(day);
        this.amount = prop(amount);
        this.category = prop<Category>(new Category());
    }

    public toJSON = () => {
        return {
            id: this.id(),
            name: this.name(),
            day: this.day(),
            amount: this.amount(),
            category: this.category().id()
        };
    }

    public clone = () => {

        let currentDay = this.day();
        if (currentDay != null) {
            currentDay = currentDay.clone();
        }

        let clone = new Expense(this.name(), currentDay, this.amount());
        clone.id(this.id());
        clone.category(this.category().clone());
        return clone;
    }

    public update = (modified: Expense) => {
        this.name(modified.name());
        this.day(modified.day());
        this.amount(modified.amount());
        this.category(modified.category());
    }
}
