/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import BudgetContext from "../data/budgetcontext";
import WeeklyGraphComponent from "./weeklygraph";
import CategoryGraphComponent from "./categorygraph";

class SummaryController implements _mithril.MithrilController {
    public graph: _mithril.MithrilComponent<{}>;

    constructor(context: BudgetContext, graphType: string) {
        switch(graphType) {
            case "weekly":
                this.graph = new WeeklyGraphComponent(context);
                break;
            case "categories":
                this.graph = new CategoryGraphComponent(context);
                break;
            default:
                this.graph = new WeeklyGraphComponent(context);
                break;
        }
    }
}

export default class SummaryComponent implements
    _mithril.MithrilComponent<SummaryController> {

    constructor(private context: BudgetContext) {
    }

    public controller = () => {
        let graphType = m.route.param("type");
        return new SummaryController(this.context, graphType);
    };

    public view = (ctrl: SummaryController) => {
        return m(ctrl.graph);
    };
}