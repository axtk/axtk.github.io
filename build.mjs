import {exec as defaultExec} from 'node:child_process';
import {access, readdir, rm} from 'node:fs/promises';
import {promisify} from 'node:util';

const sourceDir = 'src';
const targetDir = 'assets/0';

const exec = promisify(defaultExec);
const target = process.argv[2];

async function customBuild(dir) {
    let path = `${sourceDir}/${dir}/build.mjs`;

    try {
        await access(path);
        await exec(`node ${path}`);
    }
    catch {}
}

async function compile(dir) {
    let path = `${sourceDir}/${dir}/index.ts`;

    try {
        await access(path);
        await exec(`npx esbuild ${path} --outdir=${targetDir}/${dir} --platform=browser --bundle --minify`);
    }
    catch {}
}

async function build(dir) {
    try {
        await access(`${sourceDir}/${dir}`);
        await Promise.all([
            customBuild(dir),
            compile(dir),
        ]);
    }
    catch {}
}

(async () => {
    if (target) {
        await rm(`${targetDir}/${target}`, {recursive: true, force: true});
        await build(target);
    }
    else {
        await rm(targetDir, {recursive: true, force: true});

        try {
            await access(sourceDir);
            await Promise.all((await readdir(sourceDir)).map(build));
        }
        catch {}
    }
})();
