import * as m from "mithril";
import * as prop from "mithril/stream";
import * as Moment from "moment";
import {extendMoment} from "moment-range";
import * as d3 from "d3";
import BudgetContext from "../data/budgetcontext";
import Category from "../categories/category";
import Expense from "../expenses/expense";

const moment = extendMoment(Moment);

class CategoryData {
    category: prop.Stream<Category>;
    expenses: prop.Stream<Expense[]>;

    constructor(category: Category, expenses: Expense[]) {
        this.category = prop(category);
        this.expenses = prop(expenses);
    }

    public expenditure = () => {
        let spent = this.expenses().reduce<number>((previous, current, index) => {
            return previous + current.amount();
        }, 0);

        return spent * -1;
    }
}

export class CategoryGraphController {

    categories: prop.Stream<CategoryData[]>;
    day: prop.Stream<Moment.Moment>;

    constructor(private context: BudgetContext) {
        this.day = prop(moment());
        this.categories = prop([]);
        context.addUpdateCallback(this.contextCallback);

        this.fetchCategories();
    }

    private contextCallback = () => {
        this.fetchCategories();
    }

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    }

    private fetchCategories = () => {
        let expenses: Expense[] = this.context.listExpenses();

        let start = this.day().clone().startOf("week").subtract(1, "week");
        let end = this.day().clone();
        let range = (<any>moment).range(start, end);

        let expensesInRange = expenses.filter(e => {
            return range.contains(e.day(), { exclusive: false });
        });

        let categories = this.context
            .listCategories()
            .map(c => {
                let data = expensesInRange.filter(e => {
                    return e.category().id() === c.id();
                });
                return new CategoryData(c, data);
            });

        this.categories(categories);
    }
}

export class CategoryGraphComponent implements
    m.ClassComponent<CategoryGraphController> {

    private loadGraphData: (data: CategoryData[]) => void;

    constructor(private context: BudgetContext) { }

    public oninit = (node: m.CVnode<CategoryGraphController>) => {
        let date = m.route.param("date");
        let day = moment(date);
        node.attrs.day(day);
    }

    public view = (node: m.CVnode<CategoryGraphController>) => {
        let ctrl = node.attrs;
        return m("div", { id: "graph" });
    }

    public onupdate = (node: m.CVnode<CategoryGraphController>) => {
        let categories = node.attrs.categories();
        this.loadGraphData(categories);
    }

    public oncreate = (node: m.CVnode<CategoryGraphController>) => {
        let element = document.getElementById("graph");
        let margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        };

        let width = 700 - margin.left - margin.right;
        let height = 450 - margin.top - margin.bottom;

        let x = d3.scaleBand()
            .rangeRound([0, width]);

        let y = d3.scaleLinear()
            .range([height, 0]);

        let xAxis = d3.axisBottom(x);

        let yAxis = d3.axisLeft(y);

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
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.expenditure()))
                .on("mouseover", function (datum: CategoryData) {
                    d3
                        .select(d3.event.currentTarget)
                        .selectAll(".bar")
                        .attr("opacity", "1");
                })
                .on("mouseout", function (datum: CategoryData) {
                    d3
                        .select(d3.event.currentTarget)
                        .selectAll(".bar")
                        .attr("opacity", "0");
                });

            bar.append("text")
                .attr("dy", "-.35em")
                .attr("opacity", "0")
                .text((datum: CategoryData) => datum.expenditure());
        };

        let categories = node.attrs.categories();
        this.loadGraphData(categories);
    }
}