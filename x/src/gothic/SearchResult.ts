import type {MatchedItem} from './MatchedItem';

export type SearchResult = {
    expressions: {
        value: string;
        captureIndex: number;
    }[];
    entries: MatchedItem[];
};
