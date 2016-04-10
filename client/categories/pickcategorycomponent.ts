/// <reference path="../../typings/browser.d.ts" />

import m = require("mithril");
import * as ViewHelpers from "../utils/viewhelpers";
import BudgetContext from "../data/budgetcontext";
import Category from "./category";

class PickCategoryController {
    constructor(private context: BudgetContext) { }

    public categoryOptions = () => {
        return [
            new ViewHelpers.Option("", "Select a Category"),
            new ViewHelpers.Option(1, "Gas"),
            new ViewHelpers.Option(2, "Rent"),
            new ViewHelpers.Option(3, "Groceries"),
            new ViewHelpers.Option(4, "Restaurant")
        ];
    };
}

export default class PickCategoryComponent implements
    _mithril.MithrilComponent<PickCategoryController> {

    constructor(private context: BudgetContext) { }

    public controller = () => {
        return new PickCategoryController(this.context);
    };

    public view = (ctrl: PickCategoryController, args: { selectedValue: number, select: (value: number) => void }) => {
        return m("div.field", [
            m("label[for='category']", "Category"),
            m("div.two.fields", [
                m("div.field", [
                    m("select[id='category'].ui.selection.dropdown", { config: ViewHelpers.createDropdown({ sortSelect: true }), onchange: ViewHelpers.withNumber("value", args.select), value: args.selectedValue },
                        ViewHelpers.writeOptions(args.selectedValue, ctrl.categoryOptions()))
                ]),
                m("div.field", [
                    m("button.ui.button[type='button']", {
                        onclick: () => {
                            $("#category").dropdown("clear");
                            $("#category").dropdown("set text", "Select a Category");
                            $("#category").siblings("div.text").addClass("default");
                        }
                    }, "Clear Category")
                ])
            ])
        ]);
    };
}