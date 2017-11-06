import * as m from "mithril";
import * as prop from "mithril/stream";

export class ModalController {

    public isVisible: prop.Stream<boolean>;
    public title: string;
    public hasImageContent: boolean;
    public content: Array<m.Vnode<any, any>>;
    public actions: Array<m.Vnode<any, any>>;

    public update(isVisible: prop.Stream<boolean>, title: string,
        hasImageContent: boolean, content: Array<m.Vnode<any, any>>,
        actions: Array<m.Vnode<any, any>>) {
        this.isVisible = isVisible;
        this.title = title;
        this.hasImageContent = hasImageContent;
        this.content = content;
        this.actions = actions;
    }
}

export class ModalComponent implements m.ClassComponent<ModalController> {

    private generated: boolean;

    constructor() {
        this.generated = false;
    }

    public view(node: m.CVnode<ModalController>) {
        let ctrl = node.attrs;
        return m("div.ui.modal", { key: 1 },
            [
                m("i.close.icon"),
                m("div.header", ctrl.title),
                m("div.content", { "class": ctrl.hasImageContent ? "image" : "" }, ctrl.content),
                m("div.actions", ctrl.actions)
            ]);
    }

    public oncreate = (node: m.CVnode<ModalController>) => {
        let element = $("div.ui.modal");
        let show = node.attrs.isVisible;

        (<any>element)
            .modal({
                detachable: false,
                onHidden: () => {
                    show(false);
                }
            });

        if (show()) {
            (<any>element).modal("show");
        } else {
            (<any>element).modal("hide");
        }
    }
}