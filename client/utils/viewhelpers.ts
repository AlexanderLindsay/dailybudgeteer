import * as m from "mithril";

export class Option<T> {
    constructor(public value: T, public text: string, public isDefault: boolean = false) { }
}

export function writeOptions(selected: any | any[], options: Option<any>[]) {
    "use strict";
    return options.map((opt) => {
        let isSelected = false;
        if (selected instanceof Array) {
            isSelected = selected.indexOf(opt.value) >= 0;
        } else {
            isSelected = selected === opt.value;
        }

        return m("option", {
            value: opt.value,
            selected: isSelected,
            disabled: opt.isDefault,
            hidden: opt.isDefault
        }, opt.text);
    });
}

export function writeOptionItems(options: Option<any>[]) {
    "use strict";
    return options.map(o => {
        return m("div.item", { "data-value": o.value }, o.text);
    });
}

export function convertWithAttr<T>(converter: (value: string) => T, property: string, callback: (value: T) => void) {
    "use strict";
    return m.withAttr(property, (value: string) => {
        callback(converter(value));
    }, null);
}

export let withNumber = convertWithAttr.bind(null, (value: string) => {
    "use strict";
    if (value === "" || value === null || value === undefined) {
        return null;
    }
    return +value;
});