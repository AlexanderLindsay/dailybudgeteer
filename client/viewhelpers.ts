import * as m from "mithril";

export class Option<T> {
    constructor(public value: T, public text: string) { }
}

export function WriteOptions<T>(selected: T | T[], options: Option<T>[]) {
    return options.map((opt) => {
        let isSelected = false;
        if (selected instanceof Array) {
            isSelected = selected.indexOf(opt.value) >= 0;
        } else {
            isSelected = selected === opt.value;
        }

        return m("option", { value: opt.value, selected: isSelected }, opt.text);
    });
}

export function ConvertWithAttr<T>(converter: (value: string) => T, property: string, callback: (value: T) => void) {
    return m.withAttr(property, (value: string) => {
        callback(converter(value));
    }, null);
}

export let withNumber = ConvertWithAttr.bind(null, (value: string) => {
    return +value;
});