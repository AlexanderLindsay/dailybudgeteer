/// <reference path="../typings/browser.d.ts" />
/// <reference path="rates/ratewidgetcomponent.ts" />
/// <reference path="expenses/expensewidgetcomponent.ts" />
/// <reference path="filehandling/dragdrop.ts" />
let root = document.getElementById("root");

let handler = new FileHandling.FileHandler(root, {
    onchange: (files: FileList) => {
        let reader = new FileReader();
        reader.onload = (e: Event) => {
            let data = JSON.parse(reader.result);
            console.log(data);
        };

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            reader.readAsText(file);
        }
    }
});

m.route.mode = "search";

m.route(root, "/", {
    "/": new RateWidget.RatesWidgetComponent(),
    "/expenses": new ExpenseWidget.ExpenseWidgetComponent()
});