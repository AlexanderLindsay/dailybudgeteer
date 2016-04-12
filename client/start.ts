/// <reference path="../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import BudgetContext from "./data/budgetcontext";
import FileDialog from "./filehandling/dialog";
import * as Menu from "./components/menu";
import {PageModel, Page} from "./components/page";
import RatesComponent from "./rates/ratecomponent";
import ExpenseComponent from "./expenses/expensecomponent";
import SummaryComponent from "./summary/summarycomponent";
import CategoryComponent from "./categories/categorycomponent";
import * as DF from "./utils/dateFormatter";
let fs = require("fs");

let root = document.getElementById("root");
let fileDialog = new FileDialog();

let budgetDataKey = "BudgetData";
let fileNameKey = "BudgetFileName";

let storedFileName = localStorage.getItem(fileNameKey) || "";
let loadDataFromFile = storedFileName.length > 0;
let context: BudgetContext;

if (loadDataFromFile) {
    context = new BudgetContext();
    fs.readFile(storedFileName, "utf-8", (err: any, data: any) => {
        m.startComputation();
        context.loadData(data);
        m.endComputation();
    });
} else {
    let storedBudgetData = localStorage.getItem(budgetDataKey) || "";
    context = new BudgetContext(storedBudgetData);
}

let menu = new Menu.MenuComponent([
    new Menu.MenuItem(new RegExp("expenses"), `/expenses/${DF.formatDateForUrl(moment())}`, "Expenses"),
    new Menu.MenuItem(new RegExp("rates"), `/rates/${DF.formatDateForUrl(moment())}`, "Rates"),
    new Menu.MenuItem(new RegExp("summary"), `/summary/${DF.formatDateForUrl(moment())}`, "Summary")
]);

let pageModel = new PageModel(root, context, fileDialog, fileNameKey, storedFileName);

let page = Page.bind(null, pageModel, menu);

m.route.mode = "search";

m.route(root, `/expenses/${DF.formatDateForUrl(moment())}`, {
    "/rates/:date": new page(new RatesComponent(context)),
    "/expenses/:date": new page(new ExpenseComponent(context)),
    "/summary/:date": new page(new SummaryComponent(context)),
    "/categories": new page(new CategoryComponent(context))
});