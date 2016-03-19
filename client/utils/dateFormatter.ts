import * as moment from "moment";

export let formats = {
    urlFormat: "YYYY-MM-DD",
    pickerFormat: "YYYY-MM-DD",
    displayFormat: "dddd, MMMM Do YYYY"
};

function formatDate(date: moment.Moment, format: string) {
    if (date == null || !date.isValid()) {
        return "";
    }

    return date.format(format);
}

export function formatDateForUrl(date: moment.Moment) {
    return formatDate(date, formats.urlFormat);
}

export function formatDateForPicker(date: moment.Moment) {
    return formatDate(date, formats.pickerFormat);
}

export function formatDateForDisplay(date: moment.Moment) {
    return formatDate(date, formats.displayFormat);
}