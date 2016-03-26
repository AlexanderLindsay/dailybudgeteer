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
import * as DF from "./utils/dateFormatter";

let root = document.getElementById("root");
let context = new BudgetContext();
let fileDialog = new FileDialog();

let menu = new Menu.MenuComponent([
   new Menu.MenuItem(new RegExp("expenses"), `/expenses/${DF.formatDateForUrl(moment())}`, "Expenses"),
   new Menu.MenuItem(new RegExp("rates"), `/rates/${DF.formatDateForUrl(moment())}`, "Rates"),
   new Menu.MenuItem(new RegExp("summary"), `/summary/${DF.formatDateForUrl(moment())}`, "Summary")
]);

let pageModel = new PageModel(root, context, fileDialog);

let page = Page.bind(null, pageModel, menu);

m.route.mode = "search";

m.route(root, `/expenses/${DF.formatDateForUrl(moment())}`, {
    "/rates/:date": new page(new RatesComponent(context)),
    "/expenses/:date": new page(new ExpenseComponent(context)),
    "/summary/:date": new page(new SummaryComponent(context))
});