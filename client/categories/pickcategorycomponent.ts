import m = require("mithril");
import * as ViewHelpers from "../utils/viewhelpers";
import BudgetContext from "../data/budgetcontext";
import Category from "./category";

export class PickCategoryController {
    constructor(private context: BudgetContext) { }

    public selected: Category;
    public select: (value: Category) => void;
    public defaultText: string = "Select a Category";

    public categoryOptions = () => {
        let catList = this.context.listCategories();
        let options = catList.map((cat) => {
            return new ViewHelpers.Option(cat.id().toString(), cat.name());
        });
        options.unshift(new ViewHelpers.Option("", this.defaultText, true));
        return options;
    }

    public pickCategory = (select: (value: Category) => void, id: number) => {
        var cat = this.context.getCategory(id);
        if (cat === null) {
            cat = new Category();
        } else {
            cat = cat.clone();
        }
        select(cat);
    }

    public getSelectedValue = (id: number) => {
        if (id == null || id === 0) {
            return "";
        }

        return `${id}`;
    }
}

export class PickCategoryComponent implements
    m.ClassComponent<PickCategoryController> {

    constructor(private context: BudgetContext) { }

    public view = ({attrs}: m.CVnode<PickCategoryController>) => {

        let ctrl = attrs;
        let hasValue: boolean = ctrl.selected.id() > 0;

        return m("div.field", [
            m("label[for='category']", "Category"),
            m("div.two.fields", [
                m("div.field",
                    m("select", {
                        className: hasValue ? "" : "placeholder",
                        onchange: ViewHelpers.withNumber("value", (id:number) => ctrl.pickCategory(ctrl.select, id))
                    },
                        ViewHelpers.writeOptions(ctrl.getSelectedValue(ctrl.selected.id()), ctrl.categoryOptions()))
                ),
                m("div.field", [
                    m("button.ui.button[type='button']", {
                        onclick: () => {
                            ctrl.pickCategory(ctrl.select, 0);
                        }
                    }, "Clear Category")
                ])
            ])
        ]);
    }
}