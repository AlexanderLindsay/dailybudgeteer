/// <reference path="../../typings/browser.d.ts" />

import m = require("mithril");
import * as ViewHelpers from "../utils/viewhelpers";
import BudgetContext from "../data/budgetcontext";

class PickCategoryController {
    constructor(private context: BudgetContext) { }

    public categoryOptions = () => {
        let catList = this.context.listCategories();
        let options = catList.map((cat) => {
            return new ViewHelpers.Option(cat.id().toString(), cat.name());
        });
        options.unshift(new ViewHelpers.Option("", "Select a Category"));
        return options;
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
                    m("select[id='category'].ui.selection.dropdown",
                        {
                            config: ViewHelpers.createDropdown({ sortSelect: true }),
                            onchange: ViewHelpers.withNumber("value", args.select), value: args.selectedValue
                        },
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