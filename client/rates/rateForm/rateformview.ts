module RateWidget {
    "use strict";

    export var rateFormView: _mithril.MithrilView<RateFormController> = (ctrl: RateFormController) => {
        
        var rate = ctrl.vm.rate();
        
        return m("div", [
                m("input[type='text']", { onchange: m.withAttr("value", rate.name), value: rate.name()}),
                m("input[type='number']", { onchange: m.withAttr("value", rate.amount), value: rate.amount()}),
                m("input[type='number']", { onchange: m.withAttr("value", rate.days), value: rate.days()}),
                m("button", {onclick: ctrl.vm.saveRate}, "Save")
            ]);
    };
}