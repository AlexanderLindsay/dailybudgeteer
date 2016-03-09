import * as ava from "ava";
import * as moment from "moment";
import BudgetContext from "../client/data/budgetcontext";

ava.test("Round trip data", (t) => {
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

    let bc = new BudgetContext();
    bc.loadData(data);
    t.is(bc.writeData(), data);
});