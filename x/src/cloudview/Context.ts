import type {Sort} from 'yd-sdk';
import type {ViewItem} from './ViewItem';

export type RenderingContext = {
    container?: string | Element;
    navContainer?: string | Element;
    getDisplayedDate?: (item: ViewItem, ctx: Context) => string | undefined;
    getDescription?: (item: ViewItem, ctx: Context) => string | undefined;
    renderItems?: (ctx: Context) => void;
    renderNav?: (ctx: Context) => void;
};

export type InputContext = RenderingContext & {
    publicKey?: string;
    indexPublicKey?: string;
    pageSize?: number;
    sort?: Sort;
    cropPreview?: boolean;
    dateFormat?: 'full' | 'short';
    homePage?: string;
};

export type ViewContext = {
    startIndex?: number;
    fileIndex?: number | undefined;
    fileName?: string | undefined;
    mode?: 'list' | 'standalone';
    indexContent?: string | null;
    items?: ViewItem[];
    total?: number;
};

export type Context = InputContext & ViewContext;
