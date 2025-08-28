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

For the sake of scalability, it makes sense to use `index` files. The effective equivalence of the path locations `dir/x/index.ts` and `dir/x.ts` as `'dir/x'` in imports allows:
- to scale up from a single file to a collection of files without changing imports throughout the app;
- to avoid the tautology like `import {Component} from 'ui/Component/Component';`.

`index` files shouldn't be used as long lists of re-exports. They should be used mostly as ordinary files with a single non-type export named exactly as the directory, with the same casing.

## Structure

This approach to structuring the app is technology-agnostic, but here, for the sake of clarity, we are going with an Express server as the only prerequisite.

The fractal web app design roughly boils down to the following file structure:

```sh
src
  entries # split by semantics, rendering strategy, or technology
    <entry-name> # can be called `main` if there's just one entry
      public # for the entry point's public assets
      server # `server.ts` or `server/index.ts` exports an instance of Express Router
      types
      ui
        <feature>
          Component
            index.css
            index.tsx
          types
          utils
        Component
          index.css
          index.tsx # not `Component/Component.tsx`, exports `Component` and `ComponentProps`
        index.tsx # CSR entry point, `hydrateRoot()` in React apps
      utils
  lib # would-be packages, pre-publishing, and patched external libs
    <package-name>
  public # for publicly available files shared by multiple entries
  server
    middleware
    types
    utils
    index.ts # plugs in the required entry points' Express Routers
  types # shared types
    CustomEntity.ts # exports `type CustomEntity`
  ui # UI components shared by multiple entries
  utils # shared utils
    getValue.ts # exports only `function getValue` (and possibly `type GetValueParams`)
```

All the code resides in the `src` directory. `src/server` contains the app server code, all other directories in `src` are optional.

The `src/entries` directory contains the app's entry points. I recommend to start the app code at least with a single entry (called `main`). Creating an entry doesn't add too much complexity to the file structure but it draws an explicit boundary to the app code. Once another entry point is needed adding it will be very easy.

Each entry point in `src/entries` exports an Express Router (or a similar self-contained unit, if it's not an Express app) in `server.ts` or `server/index.ts`. With this convention, the tech stack behind the Express Router doesn't matter much to the app. This makes entry points easily pluggable (and unpluggable) in the app server code inside `src/server`.

`src` and `src/server` can contain `utils` for shared utility functions, `types` for shared types (again with a single export per file named exactly as the export), `ui` for UI components. I prefer `ui` over `client` since the latter feels a little less direct and self-explanatory to a reader, but either name can work.

Each entry point replicates the basic structure of the app (as mentioned in the *Key points* section) and can contain the same set of subdirectories as `src`: `server`, `utils`, `types`, `ui`. The recurrence of the same file structure across different parts of the app helps with both reading the code as well as with decision making while writing the code.

`src/public` contains files directly exposed by the server. Each entry point can again have their own `public` directory exposed through the entry point's Express Router. As long as the public assets are specific to a single entry point they should stay inside the entry point's directory. Otherwise, they can be lifted to `src/public`.

`src/lib` is a pre-package antechamber. In real-life, publishing a chunk of code as a standalone package takes time: it might need a number of iterations to take a stable shape in order to meet the current requirements and it might take time to actually publish it. `src/lib` should contain directories acting like standalone packages in regard to exports and imports. `src/lib` can also contain patched versions of existing external libs.

Components in the `ui` directories should contain UI component directories (in `PascalCase` with React components) and/or feature directories in lower case. Each feature directory can further contain a set of component directories and/or other nested features. Each component directory `X` should contain an `index` file (`index.tsx` with TS + React) exporting a component named `X` (and possibly `type XProps` with React components).

~

## Demos

- [React app](https://github.com/t8js/webapp-react)
- [Blank app](https://github.com/t8js/webapp-blank)
