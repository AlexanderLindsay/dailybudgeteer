import * as m from "mithril";
import * as prop from "mithril/stream";

export class ModalController<T> {
    constructor(
        public show: prop.Stream<boolean>,
        public title: string,
        public imageContent: boolean,
        public renderContent: () => Array<m.CVnode<T>>,
        public renderActions: () => Array<m.CVnode<T>>
    ) { }
}

export class ModalComponent<T> implements m.ClassComponent<ModalController<T>> {

    public view(node: m.CVnode<ModalController<T>>) {
        let ctrl = node.attrs;
        return m("div.ui.modal",
            [
                m("i.close.icon"),
                m("div.header", ctrl.title),
                m("div.content", { "class": ctrl.imageContent ? "image" : "" }, ctrl.renderContent()),
                m("div.actions", ctrl.renderActions())
            ]);
    }

    public oncreate = (node: m.CVnode<ModalController<T>>) => {
        let element = $("div.ui.dimmer.modals > div.ui.modal");
        let show = node.attrs.show;

        console.log(element);
        if (element.length === 0) {
            let newModal = $("div.ui.modal");
            console.log(newModal);
            (<any>newModal).modal({
                onVisible: () => {
                    show(true);
                },
                onHidden: () => {
                    show(false);
                }
            });
        }

        if (node.attrs.show()) {
            (<any>element).modal("show");
        } else {
            (<any>element).modal("hide");
        }
    }
}