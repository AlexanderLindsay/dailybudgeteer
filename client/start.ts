/// <reference path="../typings/browser.d.ts" />
/// <reference path="rates/ratewidgetcomponent.ts" />
/// <reference path="expenses/expensewidgetcomponent.ts" />
/// <reference path="filehandling/dragdrop.ts" />
let root = document.getElementById("root");
let handler = new FileHandling.FileHandler(root, {
    onchange: (files: FileList) => {
        for (let i = 0; i < files.length; i++) {
            console.log(files[i].path);
        }
    }
});

m.route.mode = "search";

m.route(root, "/", {
    "/": new RateWidget.RatesWidgetComponent(),
    "/expenses": new ExpenseWidget.ExpenseWidgetComponent()
});