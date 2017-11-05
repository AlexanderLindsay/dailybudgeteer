import * as prop from "mithril/stream";

interface IDataSource< T > {
    item: prop.Stream<T>;
    list: prop.Stream<T[]>;
    edit: (id: number) => void;
    remove: (id: number) => void;
    save: () => void;
    allowEdit: (id: number) => boolean;
    allowRemove: (id: number) => boolean;
}

export default IDataSource;