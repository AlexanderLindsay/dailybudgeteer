namespace ViewHelpers {
    "use strict";

    export class Option<T> {
        constructor(public value: T, public name: string) { }
    }

    export function WriteOptions<T>(selected: T | T[], options: Option<T>[]) {
        return options.map((opt) => {
            let isSelected = false;
            if (selected instanceof Array) {
                isSelected = selected.indexOf(opt.value) >= 0;
            } else {
                isSelected = selected === opt.value;
            }

            let selectedAttribute = "";
            if (isSelected) {
                selectedAttribute = "[selected]";
            }

            return m(`option[value='${opt.value}']${selectedAttribute}`, opt.name);
        });
    }
}