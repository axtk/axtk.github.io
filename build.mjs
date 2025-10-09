import {exec as originalExec, spawn as originalSpawn} from 'node:child_process';
import {access, lstat, readdir, rm} from 'node:fs/promises';
import {platform} from 'node:os';
import {promisify} from 'node:util';

const sourceDir = 'x/src';
const targetDir = 'x/assets/0';

const exec = promisify(originalExec);
const targets = process.argv.slice(2);

function spawn(command, args, options) {
    return new Promise((resolve, reject) => {
        let p = originalSpawn(command, args, options);
        let stdout = '';
        let stderr = '';

        p.stdout?.on('data', (data) => {
            stdout += data.toString();
        });

        p.stderr?.on('data', (data) => {
            stderr += data.toString();
        });

        p.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr, code });
            } else {
                let error = new Error(`Command failed with exit code ${code}`);
                error.code = code;
                error.stdout = stdout;
                error.stderr = stderr;
                reject(error);
            }
        });

        p.on('error', (err) => {
            reject(err);
        });
    });
}

function exists(path) {
    return access(path).then(() => true, () => false);
}

function missing(path) {
    return access(path).then(() => false, () => true);
}

async function customBuild(dir) {
    let dirPath = `${sourceDir}/${dir}`;
    let path = `${dirPath}/build.mjs`;

    if (await missing(path))
        return;

    console.log(`[${dirPath}] running custom build`);
    await exec(`node ${path}`);
}

async function checkDependencies(dir) {
    let dirPath = `${sourceDir}/${dir}`;

    if ((await missing(`${dirPath}/package.json`)) || (await exists(`${dirPath}/node_modules`)))
        return;

    console.log(`[${dirPath}] installing dependencies`);

    let npmCmd = platform().startsWith('win') ? 'npm.cmd' : 'npm';

    try {
        await spawn(npmCmd, ['i'], {
            env: process.env,
            cwd: dirPath,
            stdio: 'inherit',
            shell: true,
        });
    }
    catch (error) {
        console.error(error);
    }
}

async function compile(dir) {
    let dirPath = `${sourceDir}/${dir}`;
    let path = `${dirPath}/index.ts`;

    if (await missing(path))
        return;

    console.log(`[${dirPath}] compiling`);
    await exec(`npx esbuild ${path} --outdir=${targetDir}/${dir} --platform=browser --bundle --minify`);
}

async function build(dir) {
    let dirPath = `${sourceDir}/${dir}`;

    if (await missing(dirPath))
        return;

    console.log(`[${dirPath}] building`);
    await checkDependencies(dir);
    await Promise.all([
        customBuild(dir),
        compile(dir),
    ]);
}

(async () => {
    if (targets.length) {
        for (let target of targets) {
            await rm(`${targetDir}/${target}`, {recursive: true, force: true});
            await build(target);
        }
    }
    else {
        await rm(targetDir, {recursive: true, force: true});

        if (await missing(sourceDir))
            return;

        let dirs = await readdir(sourceDir);

        for (let dir of dirs) {
            if (!(await lstat(`${sourceDir}/${dir}`)).isDirectory())
                continue;

            await build(dir);
        }
    }
})();
