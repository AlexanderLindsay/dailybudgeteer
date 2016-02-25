/// <reference path="../typings/browser.d.ts" />
/// <reference path="data/budgetcontext.ts" />
/// <reference path="rates/ratewidgetcomponent.ts" />
/// <reference path="expenses/expensewidgetcomponent.ts" />
/// <reference path="filehandling/dragdrop.ts" />
/// <reference path="components/menu.ts" />
/// <reference path="components/page.ts" />


let root = document.getElementById("root");
let context = new Data.BudgetContext();

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

let fileDialog = new FileHandling.FileDialog();

let menu = new Components.MenuComponent([
   new Components.MenuItem("/", "Rates"),
   new Components.MenuItem("/expenses", "Expenses")
]);
let page = Components.Page.bind(null, context, fileDialog, menu);

m.route.mode = "search";

m.route(root, "/", {
    "/": new page(new RateWidget.RatesWidgetComponent(context)),
    "/expenses": new page(new ExpenseWidget.ExpenseWidgetComponent(context))
});