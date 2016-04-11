/// <reference path="../../typings/browser.d.ts" />

import m = require("mithril");
import modal from "../components/modal";
import BudgetContext from "../data/budgetcontext";
import DataSource from "../components/datasource";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import Category from "./category";

const saveTitle = "Add Category";
const saveActionName = "Add";
const editTitle = "Edit Category";
const editActionName = "Save";

class CategoryViewModel implements DataSource<Category> {

    item: _mithril.MithrilProperty<Category>;
    list: _mithril.MithrilPromise<Category[]>;
    isAddModalOpen: _mithril.MithrilProperty<Boolean>;
    modalTitle: _mithril.MithrilProperty<string>;
    modalActionName: _mithril.MithrilProperty<string>;

    constructor(private context: BudgetContext) {
        this.item = m.prop(new Category());
        this.isAddModalOpen = m.prop(false);
        this.modalTitle = m.prop(saveTitle);
        this.modalActionName = m.prop(saveActionName);
        this.list = this.fetchList();
        context.addUpdateCallback(this.contextCallback);
    }

    private contextCallback = () => {
        this.list = this.fetchList();
    };

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    };

    private fetchList = () => {
        let deferred = m.deferred<Category[]>();
        let cats = this.context.listCategories();
        deferred.resolve(cats);

        return deferred.promise;
    };

    public edit = (id: number) => {
        let category = this.context.getCategory(id);
        if (category === null) {
            this.item(new Category());
        } else {
            this.item(category.clone());
        }

        this.modalTitle(editTitle);
        this.modalActionName(editActionName);
        this.isAddModalOpen(true);
    };

    public allowEdit = (id: number) => {
        return true;
    };

    public allowRemove = (id: number) => {
        return true;
    };

    public remove = (id: number) => {
        this.context.removeCategory(id);
    };

    public save = () => {
        if (this.item().id() === 0) {
            this.context.addCategory(this.item());
        } else {
            let modified = this.item();
            let current = this.context.getCategory(modified.id());
            current.update(modified);
        }
    };

    public openAddModal = () => {
        this.item(new Category());
        this.modalTitle(saveTitle);
        this.modalActionName(saveActionName);
        this.isAddModalOpen(true);
    };
}

class CategoryController {

    public vm: CategoryViewModel;

    constructor(private context: BudgetContext) {
        this.vm = new CategoryViewModel(context);
    }
}

export default class CategoryComponent implements
    _mithril.MithrilComponent<CategoryController> {

    private formComponent: FormComponent<Category>;
    private listComponent: ListComponent<Category>;

    private static renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Description"),
        ];
    };

    private static renderItem = (category: Category) => {
        return [
            m("td", category.name()),
            m("td", category.description()),
        ];
    };

    private static renderForm = (args: { item: Category }) => {
        let category = args.item;

        return <_mithril.MithrilVirtualElement<{}>>[
            m("div.field", [
                m("label[for='name']", "Name"),
                m("input[type='text'][id='name'][placeholder='Name'].ui.input", { onchange: m.withAttr("value", category.name), value: category.name() })
            ]),
            m("div.field", [
                m("label[for='description']", "Description"),
                m("input[type='text'][id='description'][placeholder='Description'].ui.input", { onchange: m.withAttr("value", category.description), value: category.description() })
            ])
        ];
    };

    private static renderFooter = (vm: CategoryViewModel) => {
        return [
            m("th[colspan='3']", [
                m("button[type='button'].ui.primary.button", { onclick: vm.openAddModal }, "Add Category")
            ])
        ];
    };

    constructor(private context: BudgetContext) {
        this.formComponent = new FormComponent<Category>(CategoryComponent.renderForm);

        this.listComponent = new ListComponent<Category>(
            CategoryComponent.renderHeader,
            CategoryComponent.renderItem,
            CategoryComponent.renderFooter);
    }

    public controller = () => {
        return new CategoryController(this.context);
    };

    public view = (ctrl: CategoryController) => {
        return m("div.column", [
            m.component(this.listComponent, ctrl.vm),
            m.component(new modal(ctrl.vm.modalTitle(), ctrl.vm.isAddModalOpen,
                () => m.component(this.formComponent, { item: ctrl.vm.item() }),
                () => [
                    m("button.ui.approve.button[type='button']", { onclick: ctrl.vm.save }, ctrl.vm.modalActionName()),
                    m("button.ui.cancel.button[type='button]", "Cancel")
                ]))
        ]);
    };

}