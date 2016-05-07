import * as m from "mithril";
import * as moment from "moment";
import * as d3 from "d3";
import BudgetContext from "../data/budgetcontext";

class CategoryGraphViewModel {

    constructor(private context: BudgetContext, private day: moment.Moment) {
    }
}

class CategoryGraphController implements _mithril.MithrilController {
    public vm: CategoryGraphViewModel;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.vm = new CategoryGraphViewModel(context, day);
    }
}

export default class CategoryGraphComponent implements
    _mithril.MithrilComponent<CategoryGraphController> {

    constructor(private context: BudgetContext) { }

    public controller = () => {
        let date = m.route.param("date");
        let day = moment(date);
        return new CategoryGraphController(this.context, day);
    };

    public view = (ctrl: CategoryGraphController) => {
        return m("div", "categories" ); // { config: this.setupGraph.bind(this, ctrl) });
    };

    // private setupGraph = (ctrl: CategoryGraphController, element: HTMLElement, isInitialized: boolean) => {

    //     if (!isInitialized) {

    //     }
    // };
}