/// <reference path="../../typings/browser.d.ts" />

import * as m from "mithril";

class ModalController implements _mithril.MithrilController {
    constructor(public show: _mithril.MithrilProperty<Boolean>) { }
}

export default class ModalComponent implements _mithril.MithrilComponent<ModalController> {
    controller: () => ModalController;
    view: _mithril.MithrilView<ModalController>;

    constructor(title: string, show: _mithril.MithrilProperty<Boolean>,
        renderContent: () => _mithril.MithrilVirtualElement<{}> | _mithril.MithrilComponent<{}>,
        renderActions: () => _mithril.MithrilVirtualElement<{}> | _mithril.MithrilComponent<{}>,
        imageContent = false) {
        this.controller = () => new ModalController(show);
        this.view = (ctrl) => {
            return m("div.ui.modal", { config: this.setupModal.bind(ctrl, ctrl.show) }, [
                m("i.close.icon"),
                m("div.header", title),
                m("div.content", { "class": imageContent ? "image" : "" }, renderContent()),
                m("div.actions", renderActions())
            ]);
        };
    }

    private setupModal = (show: _mithril.MithrilProperty<Boolean>, element: any, isInitialized: boolean) => {

        if (!isInitialized) {
            $(element).modal({
                onVisible: () => {
                    show(true);
                },
                onHidden: () => {
                    show(false);
                }
            });
        }

        if (show()) {
            $(element).modal("show");
        } else {
            $(element).modal("hide");
        }
    };
}