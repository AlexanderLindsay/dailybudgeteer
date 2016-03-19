import * as moment from "moment";

export function formatDateForUrl(date: moment.Moment) {
    if (date == null || !date.isValid()) {
        return "";
    }

    return date.format("YYYY-MM-DD");
}