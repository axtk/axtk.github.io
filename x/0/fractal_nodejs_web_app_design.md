---
title: Fractal Node.js web app design
date: 2025-08-28
tags:
    - webdev
    - nodejs
    - typescript
    - javascript
---

## Motivation

The design discussed here is the result of my attempt to come up with a simple, self-explanatory, and scalable Node.js web app structure, ultimately comfortable to work with. I've found these qualities with a self-similar structure, hence the name *fractal design*.

By scalability I mean here mostly the following things:
- the app should be able to evolve seamlessly from a smaller app to a larger one;
  - preferably without restructuring the app much as its size changes;
  - preferably without imposing too much complexity ahead of time in anticipation of the app's potential growth;
- to reflect the reality, the app should preferably be able to maintain multiple entry points implementing different rendering strategies (such as SSR, CSR) or using some legacy tech running on the same server;
  - entry points should be loosely coupled and self-contained so that connecting and disconnecting an entry point should be nearly effortless.

## Key points

For our comfort, the code should be scalable (in the sense outlined above) and easy to navigate. Here's what can be done for that purpose:

- **Single export per file.** Several tightly related type exports alongside the main export (such as a function's parameters type) are allowed. (Single-responsibility principle)
- **Files are named exactly as their export.** With the same casing. File names should say exactly what they mean to facilitate browsing the codebase.
- **Entry points replicate the basic file structure of the app.** Entry points can be regarded as smaller self-contained quasi-apps.
- **Cross-entry-point imports are forbidden.** Files shared by multiple entry points should be lifted to a shared directory.

For the sake of scalability, it makes sense to use non-barrel `index` files. The effective equivalence of the path locations `dir/x/index.ts` and `dir/x.ts` as `'dir/x'` in imports allows:
- to scale up from a single file to a collection of files without changing imports throughout the app;
- to avoid the tautology like `import {Component} from 'ui/Component/Component';`.

`index` files should be used as ordinary files with a single non-type export named exactly as the directory, with the same casing. They shouldn't be used as barrel files just for re-exports.

## Structure

This approach to structuring the app is technology-agnostic, but here, for the sake of clarity, we are going with an Express server as the only prerequisite.

The fractal web app design essentially boils down to the following file structure:

<style>
.s {
  font-family: monospace;
  line-height: 1.3;
  --w: .05em;
  --x: .25em;
  --y: .75em;
  --px: 1.5em;
  --py: .5em;
  --c: color(from var(--color) srgb r g b / .25);
  margin: 1em 0;
}
.s ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.s li {
  padding: 0;
  margin: 0;
  position: relative;
  box-sizing: border-box;
}
.s li li {
  padding: var(--py) 0 0 var(--px);
}
.s li li::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 var(--x);
  border: var(--w) solid var(--c);
}
.s li li:last-child::before {
  height: calc(var(--py) + var(--y) - var(--w));
  bottom: auto;
}
.s li li::after {
  content: "";
  width: calc(var(--px) - var(--x) - .2em);
  position: absolute;
  inset: calc(var(--py) + var(--y)) auto auto var(--x);
  border-top: var(--w) solid var(--c);
}
.s .c {
  display: block;
  font-size: .85em;
  color: color(from var(--color) srgb r g b / .5);
}
</style>
<div class="s">
<ul>
<li>src
  <ul>
    <li>entries <span class="c"># split by semantics, rendering strategy, or technology</span>
      <ul>
        <li>[entry-name] <span class="c"># can be called `main` if there's just one entry</span>
          <ul>
            <li>public <span class="c"># for the entry point's public assets</span></li>
            <li>server <span class="c"># `server.ts` or `server/index.ts` exports an instance of Express Router</span></li>
            <li>types</li>
            <li>ui
              <ul>
                <li>[feature]
                  <ul>
                    <li>Component
                      <ul>
                        <li>index.css</li>
                        <li>index.tsx</li>
                      </ul>
                    </li>
                    <li>types</li>
                    <li>utils</li>
                  </ul>
                </li>
                <li>Component
                  <ul>
                    <li>index.css</li>
                    <li>index.tsx <span class="c"># not `Component/Component.tsx`, exports `Component` and `ComponentProps`</span></li>
                  </ul>
                </li>
                <li>types</li>
                <li>utils</li>
                <li>index.tsx <span class="c"># CSR entry point, location of `hydrateRoot()` in React apps</span></li>
              </ul>
            </li>
            <li>utils</li>
          </ul>
        </li>
      </ul>
    </li>
    <li>lib <span class="c"># would-be packages, pre-publishing + patched external libs</span>
      <ul>
        <li>[package-name]</li>
      </ul>
    </li>
    <li>public <span class="c"># for publicly available files shared by multiple entries</span></li>
    <li>server
      <ul>
        <li>middleware</li>
        <li>types</li>
        <li>utils</li>
        <li>index.ts <span class="c"># the runnable app server, plugs in the required entry points' Express Routers</span></li>
      </ul>
    </li>
    <li>types <span class="c"># shared types</span>
      <ul>
        <li>CustomEntity.ts <span class="c"># exports `type CustomEntity`</span></li>
      </ul>
    </li>
    <li>ui <span class="c"># UI components shared by multiple entries</span></li>
    <li>utils <span class="c"># shared utils</span>
      <ul>
        <li>getValue.ts <span class="c"># exports only `function getValue` (and possibly `type GetValueParams`)</span></li>
      </ul>
    </li>
  </ul>
</li>
</ul>
</div>

### `/src`

The application code resides in the `/src` directory. Other directories can serve auxiliary purposes, like `/dist` for the build result. All subdirectories of `/src` except `/src/server` are optional.

### `/src/server`

`/src/server` contains the app's server code. Just like the `/src` directory, `/src/server` can contain `utils` and `types`. It can also contain some server specific directories like `middleware`.

### `/src/entries`

The `/src/entries` directory contains the app's entry points. I recommend to start the app code at least with a single entry (called `main`). Creating an entry doesn't add too much complexity to the file structure but it draws an explicit boundary to the app code. Once another entry point is needed adding it will be easy.

Each entry point in `/src/entries` exports an Express Router (or a similar self-contained unit, if it's not an Express app) in `server.ts` or `server/index.ts`. With this convention, the tech stack behind the Express Router doesn't matter much to the app. This makes entry points easily pluggable (and unpluggable) in the app server code inside `/src/server`.

Each entry point replicates the basic structure of the app (as mentioned in the *Key points* section) and can contain the same set of subdirectories as `/src`: `server`, `utils`, `types`, `ui`. The recurrence of the same file structure across different parts of the app helps with both reading the code as well as with decision making while writing the code.

### `ui` or `client`

Each entry point can contain its own `ui` (or `client`) directory for UI components. I prefer `ui` over `client` since the latter feels a little less direct and self-explanatory to a reader, but either name can work. UI components shared by multiple entry points can be located in `/src/ui`.

Each component in a `ui` directory should be represented by a directory named after the component (in PascalCase with React components). Each component directory `X` should contain an `index` file (`index.tsx` with TS + React) exporting a component named `X` (and possibly `type XProps` with React components).

Some UI component directories can in turn be grouped into feature directories inside `ui` (with kebab-cased names). Features nested inside other features (effectively creating a chained namespace) aren't disallowed but should still be added sparingly.

### `utils`

`utils` directories can occur in many places (in `/src`, `/src/server`, `/src/entries/<entry>`, in `ui` directories). Each file in `utils` contains a utility function, with a single export per file named exactly after that export. Some files in `utils` having a certain relation to each other can further be grouped into subdirectories.

### `types`

`types` directories contain TypeScript types. Again, one export per file named after the export: a file named `CustomEntity.ts` exports `type CustomEntity`.

### `const` or `constants`

`const` or `constants` directories contain constants shared within the given context. Once again, one export per file named after the export: a file named `sharedValue.ts` exports `const sharedValue`.

### `public`

The `public` directories contains files directly exposed by the server. These directories are named `public` (rather than `assets`, for example) to be explicitly clear that the files in these directories are not private.

Each entry point can have their own `public` directory exposed through the entry point's Express Router. As long as the public files are specific to a single entry point they should stay inside the entry point's directory. This makes moving an entry point with all its essential assets to another location easier.

Public files shared by multiple entry points can still be placed into `/src/public`.

### `lib`

The `lib` directories (such as `/src/lib`) are pre-package antechambers. In real-life, publishing a chunk of code as a standalone package takes time: it might need a number of iterations to take a stable shape in order to meet the necessary requirements and it might take time to actually publish it. `lib` should contain directories acting like standalone packages in regard to exports and imports. `lib` can also contain patched versions of existing external libs.

## Demos

- [React app](https://github.com/t8js/react-app)
- [Blank app](https://github.com/t8js/blank-app)
