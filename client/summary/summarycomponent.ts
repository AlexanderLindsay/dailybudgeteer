import * as m from "mithril";
import BudgetContext from "../data/budgetcontext";
import {WeeklyGraphComponent, WeeklyGraphController} from "./weeklygraph";
import {CategoryGraphComponent, CategoryGraphController} from "./categorygraph";

export class SummaryController {
    public graph: m.ClassComponent<any>;
    public data: WeeklyGraphController | CategoryGraphController;

    constructor(private context: BudgetContext) {
       this.changeGraphType("");
    }

    changeGraphType = (graphType) => {
        switch(graphType) {
            case "weekly":
                this.graph = new WeeklyGraphComponent(this.context);
                this.data = new WeeklyGraphController(this.context);
                break;
            case "categories":
                this.graph = new CategoryGraphComponent(this.context);
                this.data = new CategoryGraphController(this.context);
                break;
            default:
                this.graph = new WeeklyGraphComponent(this.context);
                this.data = new WeeklyGraphController(this.context);
                break;
        }
    }
}

export class SummaryComponent implements
    m.ClassComponent<SummaryController> {

    constructor(private context: BudgetContext) {
    }

    public oninit = ({attrs}: m.CVnode<SummaryController>) => {
        let graphType = m.route.param("type");
        attrs.changeGraphType(graphType);
    }

    public view = ({attrs}: m.CVnode<SummaryController>) => {
        return m(attrs.graph, attrs.data);
    }
}