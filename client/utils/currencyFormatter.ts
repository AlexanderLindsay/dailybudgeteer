export default function formatCurrency(value: number, locale: string = undefined, currency: string = "USD") {
    return value.toLocaleString(locale,
        {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}