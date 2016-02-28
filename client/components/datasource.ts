interface DataSource< T > {
    item: _mithril.MithrilProperty<T>;
    list: () => _mithril.MithrilPromise<T[]>;
    edit: (id: number) => void;
    remove: (id: number) => void;
    save: () => void;
}

export default DataSource;