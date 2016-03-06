"use strict";
class DataContext {
    constructor() {
        this.addItem = (item, list, id) => {
            item.id(id);
            list.push(item);
            return id + 1;
        };
        this.getItem = (id, list) => {
            let results = list.filter((value, index) => {
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
        this.removeItem = (id, list) => {
            let ids = list.map((item) => {
                return item.id();
            });
            let index = ids.indexOf(id);
            list.splice(index, 1);
            return list;
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataContext;
//# sourceMappingURL=datacontext.js.map