/// <reference path="../../typings/browser.d.ts" />

import m = require("mithril");
import * as ViewHelpers from "../utils/viewhelpers";
import BudgetContext from "../data/budgetcontext";
import Category from "./category";

class PickCategoryController {
    constructor(private context: BudgetContext) { }

    public defaultText: string = "Select a Category";

    public categoryOptions = () => {
        let catList = this.context.listCategories();
        let options = catList.map((cat) => {
            return new ViewHelpers.Option(cat.id().toString(), cat.name());
        });
        options.unshift(new ViewHelpers.Option("", this.defaultText, true));
        return options;
    };

    public pickCategory = (select: (value: Category) => void, id: number) => {
        var cat = this.context.getCategory(id);
        if (cat === null) {
            cat = new Category();
        } else {
            cat = cat.clone();
        }
        select(cat);
    };

    public getSelectedValue = (id: number) => {
        if (id == null || id === 0) {
            return "";
        }

        return id.toString();
    };
}

export default class PickCategoryComponent implements
    _mithril.MithrilComponent<PickCategoryController> {

    constructor(private context: BudgetContext) { }

    public controller = () => {
        return new PickCategoryController(this.context);
    };

    public view = (ctrl: PickCategoryController, args: { selected: Category, select: (value: Category) => void }) => {

        let hasValue: boolean = args.selected.id() > 0;

        return m("div.field", [
            m("label[for='category']", "Category"),
            m("div.two.fields", [
                m("div.field",
                    m("select", {
                        className: hasValue ? "" : "placeholder",
                        onchange: ViewHelpers.withNumber("value", ctrl.pickCategory.bind(this, args.select))
                    },
                        ViewHelpers.writeOptions(ctrl.getSelectedValue(args.selected.id()), ctrl.categoryOptions()))
                ),
                m("div.field", [
                    m("button.ui.button[type='button']", {
                        onclick: () => {
                            ctrl.pickCategory(args.select, 0);
                        }
                    }, "Clear Category")
                ])
            ])
        ]);
    };
}