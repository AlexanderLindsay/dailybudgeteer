/// <reference path="../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import BudgetContext from "./data/budgetcontext";
import * as FileHandling from "./filehandling/dragdrop";
import FileDialog from "./filehandling/dialog";
import * as Menu from "./components/menu";
import Page from "./components/page";
import RatesComponent from "./rates/ratecomponent";
import ExpenseComponent from "./expenses/expensecomponent";
import SummaryComponent from "./summary/summarycomponent";

let root = document.getElementById("root");
let context = new BudgetContext();

let handler = new FileHandling.FileHandler(root, {
    onchange: (files: FileList) => {
        let reader = new FileReader();
        reader.onload = (e: Event) => {
            let data = reader.result;
            m.startComputation();
            context.loadData(data);
            m.endComputation();
        };

        if (files.length > 0) {
            let file = files[0];
            reader.readAsText(file);
        }
    }
});

let fileDialog = new FileDialog();

const dateFormat = "YYYY-MM-DD";

let menu = new Menu.MenuComponent([
   new Menu.MenuItem(new RegExp("expenses"), `/expenses/${moment().format(dateFormat)}`, "Expenses"),
   new Menu.MenuItem(new RegExp("rates"), `/rates/${moment().format(dateFormat)}`, "Rates"),
   new Menu.MenuItem(new RegExp("summary"), `/summary/${moment().format(dateFormat)}`, "Summary")
]);
let page = Page.bind(null, context, fileDialog, menu);

m.route.mode = "search";

m.route(root, `/expenses/${moment().format(dateFormat)}`, {
    "/rates/:date": new page(new RatesComponent(context)),
    "/expenses/:date": new page(new ExpenseComponent(context)),
    "/summary/:date": new page(new SummaryComponent(context))
});