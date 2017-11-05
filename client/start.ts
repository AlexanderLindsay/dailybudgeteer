import * as m from "mithril";
import * as moment from "moment";
import BudgetContext from "./data/budgetcontext";
import FileDialog from "./filehandling/dialog";
import {MenuComponent, MenuController, BasicMenuItem, DropdownMenuItem} from "./components/menu";
import {PageModel, PageComponent, PageController} from "./components/page";
import RatesComponent from "./rates/ratecomponent";
import RatesController from "./rates/ratecontroller";
import ExpenseComponent from "./expenses/expensecomponent";
import ExpenseController from "./expenses/expensecontroller";
import {SummaryComponent,SummaryController} from "./summary/summarycomponent";
import {CategoryComponent,CategoryController} from "./categories/categorycomponent";
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
        context.loadData(data);
        m.redraw();
    });
} else {
    let storedBudgetData = localStorage.getItem(budgetDataKey) || "";
    context = new BudgetContext(storedBudgetData);
}

let menuModel = [
    new BasicMenuItem(new RegExp("expenses"), `/expenses/${DF.formatDateForUrl(moment())}`, "Expenses"),
    new BasicMenuItem(new RegExp("rates"), `/rates/${DF.formatDateForUrl(moment())}`, "Rates"),
    new DropdownMenuItem(new RegExp("summary"), "Summary",
        [
            new BasicMenuItem(new RegExp("weekly"), `/summary/${DF.formatDateForUrl(moment())}/weekly`, "Weekly"),
            new BasicMenuItem(new RegExp("categories"), `/summary/${DF.formatDateForUrl(moment())}/categories`, "By Category"),
        ])
];

let menu = new MenuController(menuModel);

let pageModel = new PageModel(root, context, fileDialog, fileNameKey, storedFileName);

let page = (component, controller) => {
    let pc = new PageController(pageModel, m(new MenuComponent(), menu), m(component, controller));
    return {
        view: () => m(new PageComponent(), pc)
    };
};

m.route(root, `/expenses/${DF.formatDateForUrl(moment())}`, {
    "/rates/:date": page(new RatesComponent(context), new RatesController(context)),
    "/expenses/:date": page(new ExpenseComponent(context), new ExpenseController(context)),
    "/summary/:date/:type": page(new SummaryComponent(context), new SummaryController(context)),
    "/categories": page(new CategoryComponent(context), new CategoryController(context))
});