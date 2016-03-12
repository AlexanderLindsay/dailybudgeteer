/// <reference path="../typings/browser.d.ts" />

import * as m from "mithril";
import * as moment from "moment";
import BudgetContext from "./data/budgetcontext";
import * as FileHandling from "./filehandling/dragdrop";
import FileDialog from "./filehandling/dialog";
import * as Menu from "./components/menu";
import Page from "./components/page";
import RatesWidgetComponent from "./rates/rateswidgetcomponent";
import ExpenseWidgetComponent from "./expenses/expensewidgetcomponent";

let root = document.getElementById("root");
let context = new BudgetContext();

let handler = new FileHandling.FileHandler(root, {
    onchange: (files: FileList) => {
        let reader = new FileReader();
        reader.onload = (e: Event) => {
            let data = reader.result;
            context.loadData(data);
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
   new Menu.MenuItem(`/expenses/${moment().format(dateFormat)}`, "Expenses"),
   new Menu.MenuItem(`/rates/${moment().format(dateFormat)}`, "Rates")
]);
let page = Page.bind(null, context, fileDialog, menu);

m.route.mode = "search";

m.route(root, `/expenses/${moment().format(dateFormat)}`, {
    "/rates/:date": new page(new RatesWidgetComponent(context)),
    "/expenses": new page(new ExpenseWidgetComponent(context)),
    "/expenses/:date": new page(new ExpenseWidgetComponent(context))
});