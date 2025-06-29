import {exec as defaultExec} from 'node:child_process';
import {access, readdir, rm} from 'node:fs/promises';
import {promisify} from 'node:util';

const exec = promisify(defaultExec);
const target = process.argv[2];

async function customBuild(dir) {
    let path = `src/${dir}/build.mjs`;

    try {
        await access(path);
        await exec(`node ${path}`);
    }
    catch {}
}

async function compile(dir) {
    let path = `src/${dir}/index.ts`;

    try {
        await access(path);
        await exec(`npx esbuild ${path} --outdir=dist/${dir} --platform=browser --bundle --minify`);
    }
    catch {}
}

async function build(dir) {
    try {
        await access(`src/${dir}`);
        await Promise.all([
            customBuild(dir),
            compile(dir),
        ]);
    }
    catch {}
}

(async () => {
    if (target) {
        await rm(`dist/${target}`, {recursive: true, force: true});
        await build(target);
    }
    else {
        await rm('dist', {recursive: true, force: true});

        try {
            await access('src');
            await Promise.all((await readdir('src')).map(build));
        }
        catch {}
    }
})();
