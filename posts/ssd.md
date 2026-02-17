---
title: Multi-entry-point folder structure and file conventions for scalable apps
date: 2025-08-28
update:
    - 2026-02-03
    - 2026-02-14
    - 2026-02-17
tags:
    - webdev
    - nodejs
    - typescript
    - javascript
---

The design aspects discussed here seek to address the following real-life issues:

- How to structure a codebase repo so that the app evolves from a smaller to a larger one seamlessly, without imposing complexity ahead of time?
- How **to maintain different rendering strategies** (such as SSR, CSR) within a single app?
- How **to painlessly and incrementally adopt a newer tech stack while still having older legacy code alongside** running on the same server?
- How to make a codebase easier to navigate?

Here's how the code of an application can be arranged to address the scalability issues outlined above and to keep it clean and easy to navigate.

First off, we'll put all our app's code in the `📁 src` directory to draw a clear boundary between the application's own human-readable (and often human-made) code and various auxiliaries, like `📁 node_modules`, tool configs, a `📁 dist` directory with build artifacts, that will mostly stay outside `📁 src`.

```diff
📁 src
    📁 const
    📁 utils
    📁 types
    📁 public
    📁 server
        📁 const
        📁 utils
        📁 types
        📁 middleware
        📄 index.ts // runnable app server combining entry points
    📁 ui // components shared across multiple entries
    📁 entries
        📁 [entry-name] // can be "main" for a start
            📁 const
            📁 utils
            📁 types
            📁 public
            📁 server
                📁 const
                📁 utils
                📁 types
                📁 middleware
                📄 index.ts // exports Express Router (or similar)
            📁 ui
                📁 [feature-name] // can be "app" or skipped in the beginning
                    📁 const
                    📁 utils
                    📁 types
                    📁 Component
                        📄 index.tsx // exports Component and type ComponentProps
                        📄 index.css
                📄 index.tsx // optional CSR entry point
    📁 lib // features as packages, patched third-party packages
        📁 [lib-name]
```

The runnable application server is located in `📄 src/server/index.ts`, which is pretty straightforward to spot without prior knowledge of the codebase. While most directories shown above are optional and can be added as needed, note how they create a **recurrent pattern from topmost to inmost parts** allowing for common conventions being reused over and over.

Subdirectories of `📁 entries` contain the app's entry points. A few typical use cases for different entry points include: an older and newer tech stack in the same app, an older and newer UI within a single app, a main app with a lighter marketing landing page or a user onboarding app, or multiple self-contained portions of a single app in general. An entry point can also serve an API to the rest of the app. Each entry point doesn't have to map to a single route, but it's convenient to have one parent route for an entry point.

As shown above, the app's **entry points replicate the basic app structure**, too. They can be regarded as self-contained quasi-apps that can act largely independently from each other. For this same reason, **cross-entry-point imports are strongly discouraged**. Besides reducing the cognitive load of managing intertwined parts, this precaution also makes connecting and disconnecting an entry point nearly effortless.

Each level of the app, inside and outside the `📁 entries` directory, can contain auxiliary files arranged into the directories `📁 const`, `📁 utils`, `📁 types`, and optionally other domain-specific ones like `📁 middleware`.

To facilitate navigation through the codebase, we should make file names very straightforward and transparent about their contents. The common file managing convention boils down to the following rules: (1) **Single export per file.** This rule still allows to collocate the main export with a tightly related type export, such as a function's parameters type, in the same file, which is a good practice. (2) **Files are named exactly as their export.** With the same casing. For index files, this rule applies to the parent directory's name.

```diff
📁 const
    📄 customValue.ts // export const customValue

📁 utils
    📄 getCustomValue.ts // export function getCustomValue

📁 types
    📄 CustomType.ts // export type CustomType
```

For the sake of clarity of the codebase, **using index files should be limited to small atomic parts**. Large barrel index files listing re-exports complicate the codebase navigation and create ambiguous module access points. Index files can be used, for example, for main exports of a self-contained feature or an app component (having `📄 Component/index.tsx` instead of `📄 Component/Component.tsx` is fine).

Note that public assets can be split across entry points and served independently by each entry point through their own `📁 public` directories to maintain a higher level of autonomy. To avoid duplication, resources shared across multiple entry points can still be located in the app's top-level `📁 src/public` directory served from the app's `📁 server`.

~

Adding these elements to the app's codebase should make it more flexible regarding the common scalability issues and more comfortable to work with.
