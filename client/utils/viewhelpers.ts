import * as m from "mithril";

export class Option<T> {
    constructor(public value: T, public text: string) { }
}

export function writeOptions(selected: any | any[], options: Option<any>[]) {
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

export function convertWithAttr<T>(converter: (value: string) => T, property: string, callback: (value: T) => void) {
    return m.withAttr(property, (value: string) => {
        callback(converter(value));
    }, null);
}

export let withNumber = convertWithAttr.bind(null, (value: string) => {
    if (value === "" || value === null || value === undefined) {
        return null;
    }
    return +value;
});

export function createDropdown(options?: {}) {
    return (element: any, isInitialized: boolean) => {
        if (!isInitialized) {
            $(element).dropdown(options || {});
        }
    };
}