interface DataSource< T > {
    item: _mithril.MithrilProperty<T>;
    list: () => _mithril.MithrilPromise<T[]>;
    edit: (id: number) => void;
    remove: (id: number) => void;
    save: () => void;
    allowEdit: (id: number) => boolean;
    allowRemove: (id: number) => boolean;
}

export default DataSource;