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

        let element = $("#modal");
        m.render(element.children(".header")[0], ctrl.title);
        m.render(element.children(".content")[0], ctrl.content);
        m.render(element.children(".actions")[0], ctrl.actions);
        return [];
    }

    public oncreate = (node: m.CVnode<ModalController>) => {
        let element = $("#modal");
        let show = node.attrs.isVisible;

        (<any>element)
            .modal({
                onHidden: () => {
                    show(false);
                    m.redraw();
                }
            });

        if (show()) {
            (<any>element).modal("show");
        } else {
            (<any>element).modal("hide");
        }
    }
}