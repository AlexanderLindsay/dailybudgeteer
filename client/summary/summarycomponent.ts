/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import * as d3 from "d3";
import {SummaryViewModel, SummaryController} from "./summarycontroller";
import BudgetContext from "../data/budgetcontext";
import Expense from "../expenses/expense";
import Rate from "../rates/rate";
import formatCurrency from "../utils/currencyFormatter";

export default class SummaryComponent implements
    _mithril.MithrilComponent<SummaryController> {
    constructor(private context: BudgetContext) {

    }

    public controller = () => {
        let date = m.route.param("date");
        let day = moment(date);
        return new SummaryController(this.context, day);
    };

    public view = (ctrl: SummaryController) => {
        return m("div", { config: this.setupGraph.bind(this, ctrl) });
    };

    private setupGraph = (ctrl: SummaryController, element: HTMLElement, isInitialized: boolean) => {
        let margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 700 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        let bisectDate = d3.bisector((d: Expense) => {
            return d.day().toDate();
        }).left;
        let formatDate = d3.time.format("%m/%d");
        let formatValue = function(d) { return formatCurrency(d); };

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

        let svg = d3.select(element).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        ctrl.vm.expenses.then((data) => {

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
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
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
        });
    };
}