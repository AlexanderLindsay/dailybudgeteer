/// <reference path="../typings/browser.d.ts" />
/// <reference path="data/context.ts" />
/// <reference path="rates/ratewidgetcomponent.ts" />
/// <reference path="expenses/expensewidgetcomponent.ts" />
/// <reference path="filehandling/dragdrop.ts" />

let root = document.getElementById("root");
let context = new Data.Context();

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

m.route.mode = "search";

m.route(root, "/", {
    "/": new RateWidget.RatesWidgetComponent(context),
    "/expenses": new ExpenseWidget.ExpenseWidgetComponent(context)
});