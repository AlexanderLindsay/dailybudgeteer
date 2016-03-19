import * as moment from "moment";

export let formats = {
    urlFormat: "YYYY-MM-DD",
    pickerFormat: "YYYY-MM-DD"
};

export function formatDateForUrl(date: moment.Moment) {
    if (date == null || !date.isValid()) {
        return "";
    }

    return date.format(formats.urlFormat);
}

export function formatDateForPicker(date: moment.Moment) {
    if (date == null || !date.isValid()) {
        return "";
    }

    return date.format(formats.pickerFormat);
}