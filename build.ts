import {
  exec as originalExec,
  spawn as originalSpawn,
  type SpawnOptions,
} from "node:child_process";
import { access, lstat, readdir, rm } from "node:fs/promises";
import { platform } from "node:os";
import { promisify } from "node:util";

const sourceDir = "apps/src";
const targetDir = "apps/assets/0";

const internalDeps: Record<string, string[]> = {
  album: ["cloudview"],
};

const exec = promisify(originalExec);
const targets = process.argv.slice(2);

function spawn(command: string, options: SpawnOptions) {
  return new Promise((resolve, reject) => {
    let p = originalSpawn(command, options);
    let stdout = "";
    let stderr = "";

    p.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    p.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    p.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        let error = new Error(`Command failed with exit code ${code}`);
        // error.code = code;
        // error.stdout = stdout;
        // error.stderr = stderr;
        reject(error);
      }
    });

    p.on("error", (err) => {
      reject(err);
    });
  });
}

function exists(path: string) {
  return access(path).then(
    () => true,
    () => false,
  );
}

function missing(path: string) {
  return access(path).then(
    () => false,
    () => true,
  );
}

async function customBuild(dir: string) {
  let dirPath = `${sourceDir}/${dir}`;
  let path = `${dirPath}/build.mjs`;

  if (await missing(path)) return;

  console.log(`[${dirPath}] running custom build`);
  await exec(`node ${path}`);
}

async function checkDependencies(dir: string) {
  let dirPath = `${sourceDir}/${dir}`;

  if (
    (await missing(`${dirPath}/package.json`)) ||
    (await exists(`${dirPath}/node_modules`))
  )
    return;

  console.log(`[${dirPath}] installing dependencies`);

  let npmCmd = platform().startsWith("win") ? "npm.cmd" : "npm";

  try {
    await spawn(`${npmCmd} i`, {
      cwd: dirPath,
      stdio: "inherit",
      shell: true,
    });
  } catch (error) {
    console.error(error);
  }
}

async function compile(dir: string) {
  let dirPath = `${sourceDir}/${dir}`;
  let path = `${dirPath}/index.ts`;

  if (await missing(path)) return;

  console.log(`[${dirPath}] compiling`);
  await exec(
    `npx esbuild ${path} --outdir=${targetDir}/${dir} --platform=browser --bundle --minify`,
  );
}

async function build(dir: string) {
  let dirPath = `${sourceDir}/${dir}`;

  if (await missing(dirPath)) return;

  console.log(`[${dirPath}] building`);
  await checkDependencies(dir);
  await Promise.all([customBuild(dir), compile(dir)]);
}

function checkInternalDependencies(dirs: string[]) {
  let deps: string[] = [];

  for (let dir of dirs) {
    let dirDeps = internalDeps[dir];

    if (dirDeps?.length) deps.unshift(...dirDeps);
  }

  return Array.from(new Set([...deps, ...dirs]));
}

(async () => {
  if (targets.length) {
    for (let target of targets) {
      await rm(`${targetDir}/${target}`, { recursive: true, force: true });
      await build(target);
    }
  } else {
    await rm(targetDir, { recursive: true, force: true });

    if (await missing(sourceDir)) return;

    let dirs = checkInternalDependencies(await readdir(sourceDir));

    for (let dir of dirs) {
      if (
        !dir.startsWith(".") &&
        !dir.startsWith("_") &&
        (await lstat(`${sourceDir}/${dir}`)).isDirectory()
      )
        await build(dir);
    }
  }
})();
