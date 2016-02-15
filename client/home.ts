module Home {
    "use strict";

    class HomeModel {

        public Name: _mithril.MithrilProperty<string>;

        constructor() {
            this.Name = m.prop("test");
        }
    }

    class HomeViewModel {
        public homeModel: HomeModel;

        constructor() {
            this.homeModel = new HomeModel();
        }
    }

    class HomeController implements _mithril.MithrilController {
        public vm: HomeViewModel;

        constructor() {
            this.vm = new HomeViewModel();
        }
    }

    var view: _mithril.MithrilView<HomeController> = () => {
        return m("html",
            m("body", [
                m("div", "Hello World!")
            ])
        );
    }

    export class HomeComponent implements
        _mithril.MithrilComponent<HomeController>{

        public controller: () => HomeController;
        public view: _mithril.MithrilView<HomeController>;

        constructor() {
            this.controller = () => { return new HomeController() };
            this.view = view;
        }
    }
}