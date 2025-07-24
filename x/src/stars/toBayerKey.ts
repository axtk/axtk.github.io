import {bayerDesignationMap, superscriptNumbers} from './const';

/** 'alp1' to 'α¹' */
export function toBayerKey(rawBayerKey: string | undefined) {
    let matches = rawBayerKey?.match(/^([^\d]+)(\d+)?$/);

    if (!matches)
        return rawBayerKey;

    let [, charKey = '', numKey = ''] = matches;

    if (bayerDesignationMap[charKey])
        charKey = bayerDesignationMap[charKey];

    if (numKey)
        numKey = superscriptNumbers[Number(numKey)] ?? numKey;

    return `${charKey}${numKey}`;
}
