/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import * as d3 from "d3";
import {SummaryViewModel, SummaryController} from "./summarycontroller";
import BudgetContext from "../data/budgetcontext";
import Expense from "../expenses/expense";
import Rate from "../rates/rate";

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

        let formatDate = d3.time.format("%m/%d");

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
        });
    };
}