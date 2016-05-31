import * as m from "mithril";
import * as moment from "moment";
import * as d3 from "d3";
let momentrange = require("moment-range");
import BudgetContext from "../data/budgetcontext";
import Category from "../categories/category";
import Expense from "../expenses/expense";

class CategoryData {
    category: _mithril.MithrilProperty<Category>;
    expenses: _mithril.MithrilProperty<Expense[]>;

    constructor(category: Category, expenses: Expense[]) {
        this.category = m.prop(category);
        this.expenses = m.prop(expenses);
    }

    public expenditure = () => {
        let spent = this.expenses().reduce<number>((previous, current, index) => {
            return previous + current.amount();
        }, 0);

        return spent * -1;
    };
}

class CategoryGraphViewModel {

    categories: _mithril.MithrilPromise<CategoryData[]>;

    constructor(private context: BudgetContext, private day: moment.Moment) {
        this.categories = this.fetchCategories();
        context.addUpdateCallback(this.contextCallback);
    }

    private contextCallback = () => {
        this.categories = this.fetchCategories();
    };

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    };

    private fetchCategories = () => {
        let expenses: Expense[] = this.context.listExpenses();

        let start = this.day.clone().startOf("week").subtract(1, "week");
        let end = this.day.clone();
        let range = moment.range(start, end);

        let expensesInRange = expenses.filter(e => {
            return range.contains(e.day(), false);
        });

        let categories = this.context
            .listCategories()
            .map(c => {
                let data = expensesInRange.filter(e => {
                    return e.category().id() === c.id();
                });
                return new CategoryData(c, data);
            });

        let deferred = m.deferred<CategoryData[]>();
        deferred.resolve(categories);
        return deferred.promise;
    };
}

class CategoryGraphController implements _mithril.MithrilController {
    public vm: CategoryGraphViewModel;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.vm = new CategoryGraphViewModel(context, day);
    }
}

export default class CategoryGraphComponent implements
    _mithril.MithrilComponent<CategoryGraphController> {

    private loadGraphData: (data: CategoryData[]) => void;

    constructor(private context: BudgetContext) { }

    public controller = () => {
        let date = m.route.param("date");
        let day = moment(date);
        return new CategoryGraphController(this.context, day);
    };

    public view = (ctrl: CategoryGraphController) => {
        return m("div", {
            config: this.setupGraph.bind(this, ctrl)
        });
    };

    private setupGraph = (ctrl: CategoryGraphController, element: HTMLElement, isInitialized: boolean) => {

        if (!isInitialized) {
            let margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            };

            let width = 700 - margin.left - margin.right;
            let height = 450 - margin.top - margin.bottom;

            let x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            let y = d3.scale.linear()
                .range([height, 0]);

            let xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            let yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            this.loadGraphData = (data) => {
                d3.select("#categorygraph").remove();

                let svg = d3.select(element)
                    .append("svg")
                    .attr("id", "categorygraph")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                let expenditures = data.map(c => {
                    return c.expenditure();
                });

                let maxY = d3.max(expenditures);

                x.domain(data.map(c => c.category().name()));
                y.domain([0, maxY]).nice();

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", `translate(0, ${height})`)
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -50)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Amount Spent ($)");

                let bar = svg.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("transform", (d: CategoryData) => {
                        let xCoor = x(d.category().name());
                        let yCoor = y(d.expenditure());
                        return `translate(${xCoor},${yCoor})`;
                    });

                bar.append("rect")
                    .attr("class", "bar")
                    .attr("width", x.rangeBand())
                    .attr("height", d => height - y(d.expenditure()))
                    .on("mouseover", function (datum: CategoryData) {
                        d3.select(this.nextSibling)
                            .attr("opacity", "1");
                    })
                    .on("mouseout", function (datum: CategoryData) {
                        d3.select(this.nextSibling)
                            .attr("opacity", "0");
                    });

                bar.append("text")
                    .attr("dy", "-.35em")
                    .attr("opacity", "0")
                    .text((datum: CategoryData) => datum.expenditure());
            };
        }

        ctrl.vm.categories.then(data => {
            this.loadGraphData(data);
        });
    };
}