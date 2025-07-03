import {exec as defaultExec} from 'node:child_process';
import {access, cp, lstat, readdir, rename, rm} from 'node:fs/promises';
import {promisify} from 'node:util';

const sourceDir = 'src';
const targetDir = 'assets/0';

const exec = promisify(defaultExec);
const target = process.argv[2];

async function customBuild(dir) {
    let path = `${sourceDir}/${dir}/build.mjs`;

    try {
        await access(path);
        console.log('  Running custom build');
        await exec(`node ${path}`);
    }
    catch {}
}

async function checkDependencies(dir) {
    try {
        await access(`${sourceDir}/${dir}/package.json`);

        try {
            await access(`${sourceDir}/${dir}/node_modules`);
        }
        catch {
            console.log('  Installing dependencies');
            await cp(`${sourceDir}/${dir}/package.json`, 'package.json');

            try {
                await access(`${sourceDir}/${dir}/package-lock.json`);
                await cp(`${sourceDir}/${dir}/package-lock.json`, 'package-lock.json');
            }
            catch {}

            await exec('npm i');
            await rename('node_modules', `${sourceDir}/${dir}/node_modules`);
            await rm('package.json');

            try {
                await access('package-lock.json');
                await cp('package-lock.json', `${sourceDir}/${dir}/package-lock.json`);
                await rm('package-lock.json');
            }
            catch {}
        }
    }
    catch {}
}

async function compile(dir) {
    let path = `${sourceDir}/${dir}/index.ts`;

    try {
        await access(path);
        console.log('  Compiling');
        await exec(`npx esbuild ${path} --outdir=${targetDir}/${dir} --platform=browser --bundle --minify`);
    }
    catch {}
}

async function build(dir) {
    try {
        await access(`${sourceDir}/${dir}`);
        console.log(`Building "${sourceDir}/${dir}"`);
        await checkDependencies(dir);
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

            let dirs = await readdir(sourceDir);

            for (let dir of dirs) {
                if (!(await lstat(`${sourceDir}/${dir}`)).isDirectory())
                    continue;

                await build(dir);
            }
        }
        catch {}
    }
})();
