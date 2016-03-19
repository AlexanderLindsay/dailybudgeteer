export default function formatCurrency(value: number, symbol: string = "$") {
    // let isNegative = value < 0;
    // return `${isNegative ? "-" : ""}${symbol}${Math.abs(value).toFixed(2)}`;
    return value.toLocaleString(undefined,
        {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}