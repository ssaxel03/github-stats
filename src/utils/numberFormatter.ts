export const format = (num: number) => {
    if (num < 10000) return num.toString();

    const suffixes = ["", "k", "M", "B", "T"];
    const magnitude = Math.floor(Math.log10(num) / 3);
    const scaled = num / Math.pow(10, magnitude * 3);

    return scaled.toPrecision(4) + suffixes[magnitude];
}