import * as m from "mithril";
import * as moment from "moment";
let momentrange = require("moment-range");
import * as d3 from "d3";
import BudgetContext from "../data/budgetcontext";
import Expense from "../expenses/expense";
import Rate from "../rates/rate";
import formatCurrency from "../utils/currencyFormatter";

class WeeklyGraphViewModel {

    expenses: _mithril.MithrilPromise<Expense[]>;
    rates: _mithril.MithrilPromise<Rate[]>;

    constructor(private context: BudgetContext, private day: moment.Moment) {
        this.expenses = this.fetchExpenses();
        this.rates = this.fetchRates();
        context.addUpdateCallback(this.contextCallback);
    }

    private contextCallback = () => {
        this.expenses = this.fetchExpenses();
        this.rates = this.fetchRates();
    };

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    };

    private fetchExpenses = () => {
        let perDiem = (d: moment.Moment) => {
            return this.context.listRates().reduce<number>((previous, current, index) => {
                return previous + current.perDiem(this.day);
            }, 0);
        };

        let expenses: Expense[] = this.context.listExpenses();

        let start = this.day.clone().startOf("week").subtract(1, "week");
        let end = this.day.clone();
        let range = moment.range(start, end);
        let results: Expense[] = [];
        range.by("day", d => {
            let exp = new Expense(d.format(), d, perDiem(d));
            expenses
                .filter(e => {
                    return e.day().isSame(d, "day");
                })
                .reduce<Expense>((accum, current, index) => {
                    accum.amount(accum.amount() + current.amount());
                    return accum;
                }, exp);
            results.push(exp);
        });

        let deferred = m.deferred<Expense[]>();
        deferred.resolve(results);
        return deferred.promise;
    };

    private fetchRates = () => {
        let deferred = m.deferred<Rate[]>();
        deferred.resolve(this.context.listRates().filter(rate => {
            if (rate.startDate() == null) {
                return true;
            } else if (rate.startDate().isSameOrBefore(this.day, "day")) {
                return true;
            }
            return false;
        }));
        return deferred.promise;
    };
}

class WeeklyGraphController implements _mithril.MithrilController {
    public vm: WeeklyGraphViewModel;

    constructor(context: BudgetContext, day: moment.Moment) {
        this.vm = new WeeklyGraphViewModel(context, day);
    }
}

export default class WeeklyGraphComponent implements
    _mithril.MithrilComponent<WeeklyGraphController> {

    private loadGraphData: (data: Expense[]) => void;

    constructor(private context: BudgetContext) { }

    public controller = () => {
        let date = m.route.param("date");
        let day = moment(date);
        return new WeeklyGraphController(this.context, day);
    };

    public view = (ctrl: WeeklyGraphController) => {
        return m("div", { config: this.setupGraph.bind(this, ctrl) });
    };

    private setupGraph = (ctrl: WeeklyGraphController, element: HTMLElement, isInitialized: boolean) => {

        if (!isInitialized) {
            let margin = { top: 20, right: 20, bottom: 30, left: 50 },
                width = 700 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom;

            let bisectDate = d3.bisector((d: Expense) => {
                return d.day().toDate();
            }).left;
            let formatDate = d3.time.format("%m/%d");
            let formatValue = function (d: number) { return formatCurrency(d); };

            let x = d3.time.scale()
                .range([0, width]);

            let y = d3.scale.linear()
                .range([height, 0]);

            let xAxis = d3.svg.axis()
                .scale(x)
                .ticks(d3.time.day, 1)
                .tickFormat(formatDate)
                .orient("bottom");

            let yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            let line = d3.svg.line<Expense>()
                .x(d => { return x(d.day().toDate()); })
                .y(d => { return y(d.amount()); })
                .interpolate("monotone");

            this.loadGraphData = (data) => {

                d3.select("#weeklygraph").remove();

                let svg = d3.select(element).append("svg")
                    .attr("id", "weeklygraph")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                let maxY = d3.max(data, expense => { return expense.amount(); });
                let minY = d3.min(data, expense => { return expense.amount(); });
                let absMax = Math.max(Math.abs(minY), Math.abs(maxY));

                x.domain(d3.extent(data, expense => { return expense.day().valueOf(); }));
                y.domain([-absMax, absMax]).nice();

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -50)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Income ($)");

                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);

                let focus = svg.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus.append("circle")
                    .attr("r", 4.5);

                focus.append("rect")
                    .attr("width", 90)
                    .attr("height", 40)
                    .attr("y", 3)
                    .attr("class", "focus-background");

                let focusText = focus.append("text")
                    .attr("class", "focus-text")
                    .attr("x", 7)
                    .attr("y", 0);

                focusText
                    .append("tspan")
                    .attr("class", "focus-text-one")
                    .attr("x", 5)
                    .attr("dy", "1.2em");

                focusText
                    .append("tspan")
                    .attr("class", "focus-text-two")
                    .attr("x", 5)
                    .attr("dy", "1.2em");

                svg.append("rect")
                    .attr("class", "overlay")
                    .attr("width", width)
                    .attr("height", height)
                    .on("mouseover", function () { focus.style("display", null); })
                    .on("mouseout", function () { focus.style("display", "none"); })
                    .on("mousemove", mousemove);

                function mousemove() {
                    let x0 = x.invert(d3.mouse(this)[0]);
                    let index = bisectDate(data, x0, 1);
                    let leftExpense = data[index - 1];
                    let rightExpense = data[index];

                    let xValue = x0.valueOf();

                    let exp = new Expense("", moment(xValue), 0);
                    if (leftExpense !== undefined &&
                        rightExpense !== undefined) {

                        let leftValue = leftExpense.day().valueOf();
                        let rightValue = rightExpense.day().valueOf();

                        if (xValue - leftValue > rightValue - xValue) {
                            exp = rightExpense;
                        } else {
                            exp = leftExpense;
                        }
                    }

                    focus.attr("transform", "translate(" + x(exp.day().toDate()) + "," + y(exp.amount()) + ")");
                    focus.select(".focus-text-one").text(exp.day().format("MM/DD/YYYY"));
                    focus.select(".focus-text-two").text(formatValue(exp.amount()));
                }
            };
        }
        ctrl.vm.expenses.then((data) => {
            this.loadGraphData(data);
        });
    };
}