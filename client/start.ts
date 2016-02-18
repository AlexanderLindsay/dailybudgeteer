/// <reference path="../typings/browser.d.ts" />
/// <reference path="rates/ratewidgetcomponent.ts" />
/// <reference path="expenses/expensewidgetcomponent.ts" />

m.route.mode = "search";

m.route(document.body, "/", {
    "/": new RateWidget.RatesWidgetComponent(),
    "/expenses": new ExpenseWidget.ExpenseWidgetComponent()
})