import m = require("mithril");

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