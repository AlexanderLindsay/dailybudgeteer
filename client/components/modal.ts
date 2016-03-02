class ModalController implements _mithril.MithrilController {
    constructor(public show: _mithril.MithrilProperty<Boolean>) { }
}

export default class ModalComponent implements _mithril.MithrilComponent<ModalController> {
    controller: () => ModalController;
    view: _mithril.MithrilView<ModalController>;

    constructor(title: string, show: _mithril.MithrilProperty<Boolean>,
        renderContent: () => _mithril.MithrilVirtualElement<{}>, imageContent = false) {
        this.controller = () => new ModalController(show);
        this.view = (ctrl) => {
            return m("div.ui.modal", { config: this.setupModal.bind(ctrl, ctrl.show()) }, [
                m("i.close.icon"),
                m("div.header", title),
                m(`div${imageContent ? ".image" : ""}.content`, renderContent())
            ]);
        };
    }

    private setupModal = (show: boolean, element: any, isInitialized: any) => {
        if (show) {
            $(element).modal("show");
        } else {
            $(element).modal("hide");
        }
    };
}