/// <reference path="../typings/browser.d.ts" />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ava = require("ava");
const moment = require("moment");
const budgetcontext_1 = require("../client/data/budgetcontext");
ava.test("Round trip data", (t) => __awaiter(this, void 0, void 0, function* () {
    let rate = {
        id: 1,
        name: "test rate",
        amount: -100,
        interval: 1,
        intervalType: 0,
        startDate: moment(),
        endDate: moment()
    };
    let expense = {
        id: 1,
        name: "test expense",
        day: moment(),
        amount: -50
    };
    let data = JSON.stringify({
        expenses: [
            expense
        ],
        rates: [
            rate
        ],
        nextIds: {
            expenses: 2,
            rates: 2
        }
    });
    let bc = new budgetcontext_1.default();
    bc.loadData(data);
    t.is(bc.writeData(), data);
}));
//# sourceMappingURL=testBudgetContext.js.map