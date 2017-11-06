import m = require("mithril");
import prop = require("mithril/stream");
import { ModalComponent, ModalController } from "../components/modal";
import BudgetContext from "../data/budgetcontext";
import IDataSource from "../components/datasource";
import FormComponent from "../components/formcomponent";
import ListComponent from "../components/listcomponent";
import Category from "./category";

const saveTitle = "Add Category";
const saveActionName = "Add";
const editTitle = "Edit Category";
const editActionName = "Save";

export class CategoryController implements IDataSource<Category> {

    item: prop.Stream<Category>;
    list: prop.Stream<Category[]>;
    isAddModalOpen: prop.Stream<boolean>;
    modalTitle: prop.Stream<string>;
    modalActionName: prop.Stream<string>;

    constructor(private context: BudgetContext) {
        this.item = prop(new Category());
        this.list = prop([]);
        this.isAddModalOpen = prop(false);
        this.modalTitle = prop(saveTitle);
        this.modalActionName = prop(saveActionName);
        context.addUpdateCallback(this.contextCallback);

        this.fetchList();
    }

    private contextCallback = () => {
        this.fetchList();
    }

    public onunload = () => {
        this.context.removeUpdateCallback(this.contextCallback);
    }

    private fetchList = () => {
        let categories = this.context.listCategories();
        this.list(categories);
    }

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
    }

    public allowEdit = (id: number) => {
        return true;
    }

    public allowRemove = (id: number) => {
        return true;
    }

    public remove = (id: number) => {
        this.context.removeCategory(id);
    }

    public save = () => {
        if (this.item().id() === 0) {
            this.context.addCategory(this.item());
        } else {
            let modified = this.item();
            let current = this.context.getCategory(modified.id());
            current.update(modified);
        }
        this.isAddModalOpen(false);
    }

    public openAddModal = () => {
        this.item(new Category());
        this.modalTitle(saveTitle);
        this.modalActionName(saveActionName);
        this.isAddModalOpen(true);
    }
}

export class CategoryComponent implements
    m.ClassComponent<CategoryController> {

    private formComponent: FormComponent;
    private listComponent: ListComponent<Category>;
    private modalComponent: ModalComponent;
    private modalController: ModalController;

    private static renderHeader = () => {
        return [
            m("th", "Name"),
            m("th", "Description"),
        ];
    }

    private static renderItem = (category: Category) => {
        return [
            m("td", category.name()),
            m("td", category.description()),
        ];
    }

    private static renderForm = (category: Category) => {
        return [
            m("div.field", [
                m("label[for='name']", "Name"),
                m("input[type='text'][id='name'][placeholder='Name'].ui.input",
                    { onchange: m.withAttr("value", category.name), value: category.name() })
            ]),
            m("div.field", [
                m("label[for='description']", "Description"),
                m("input[type='text'][id='description'][placeholder='Description'].ui.input",
                    { onchange: m.withAttr("value", category.description), value: category.description() })
            ])
        ];
    }

    private static renderFooter = (vm: CategoryController) => {
        return [
            m("th[colspan='3']", [
                m("button[type='button'].ui.primary.button", { onclick: () => vm.openAddModal() }, "Add Category")
            ])
        ];
    }

    constructor(private context: BudgetContext) {
        this.formComponent = new FormComponent;

        this.listComponent = new ListComponent<Category>(
            CategoryComponent.renderHeader,
            CategoryComponent.renderItem,
            CategoryComponent.renderFooter);

        this.modalComponent = new ModalComponent();
        this.modalController = new ModalController();
    }

    public view = ({ attrs }: m.CVnode<CategoryController>) => {
        let vm = attrs;

        let content = [
            m("form.ui.form", CategoryComponent.renderForm(vm.item()))
        ];

        let actions = [
            m("button.ui.approve.button[type='button']", { onclick: vm.save }, vm.modalActionName()),
            m("button.ui.cancel.button[type='button]", "Cancel")
        ];

        this.modalController.update(
            vm.isAddModalOpen,
            vm.modalTitle(),
            false,
            content,
            actions);

        return m("div.column", [
            m(this.listComponent, vm),
            m(this.modalComponent, this.modalController)
        ]);
    }

}