import type {Config} from 'glyphmap';
import type {Chars} from './Chars';

export type Context = {
    q: string;
    config: Config;
    chars: Chars;
};
