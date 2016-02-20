module Components {
    "use strict";
    
     export interface DataSource<T> {
        item: _mithril.MithrilProperty<T>;
        list: () => _mithril.MithrilPromise<T[]>;
        edit: (index: number) => void;
        remove: (index: number) => void;
        save: () => void;
    }
}