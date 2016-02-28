import IKeyed from "./keyed";

export default class DataContext {

    protected addItem = <T extends IKeyed>(item: T, list: T[], id: number) => {
        item.id(id);
        list.push(item);
        return id + 1;
    };

    protected getItem = <T extends IKeyed>(id: number, list: T[]) => {
        let results = list.filter((value: T, index: number) => {
            return value.id() === id;
        });

        if (results.length === 1) {
            return results[0];
        }

        if (results.length > 1) {
            throw "Duplicate id found";
        }

        return null;
    };

    protected removeItem = <T extends IKeyed>(id: number, list: T[]) => {
        let ids = list.map((item) => {
            return item.id();
        });

        let index = ids.indexOf(id);

        list.splice(index, 1);
        return list;
    };
}