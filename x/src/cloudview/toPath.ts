export function toPath(path: string | undefined, fileName?: string) {
    if (path)
        return `/${[...path.split('/'), fileName].filter(Boolean).join('/')}`;

    if (fileName)
        return `/${fileName}`;
}
