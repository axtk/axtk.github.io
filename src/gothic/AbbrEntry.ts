export type AbbrEntry = {
    /** Original text */
    o: string | string[];
    /** Definition */
    d: string;
    /** Definition in the English-Gothic dictionary */
    d_eg?: string;
    /**
     * Displayed text
     * @defaultValue Entry key
     */
    t?: string;
    /** Style */
    s?: 'regular' | 'i';
    /** Source (dictionary) */
    src?: 'eg' | 'ge';
    /** Group */
    g?:
        | 'lang' // language
        | 'pos'; // part of speech
};
