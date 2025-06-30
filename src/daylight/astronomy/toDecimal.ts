const {abs} = Math;

export function toDecimal(d: number, m: number, s: number) {
    let sign = (d < 0 || m < 0 || s < 0) ? -1 : 1;
    return sign*(abs(d) + abs(m)/60 + abs(s)/3600);
}
