declare global {
    interface Window {
        sendParams?: (key: string | string[], value: unknown) => void;
        /**
         * By default, `prefix` is the current URL path.
         */
        sendEvent?: (key: string | string[], prefix?: string) => void;
    }
}

export {};
