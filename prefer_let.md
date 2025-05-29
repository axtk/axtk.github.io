---
title: Prefer let over const (not the other way around)
date: 2025-05-03
updated: 2025-05-06
tags: typescript, javascript, webdev
---

Preferring `const` over `let` has become sort of mainstream (often enforced with a [linting rule](https://eslint.org/docs/latest/rules/prefer-const)), but that actually breaks their semantics and discards the developer's intention.

Semantically, `const` is a developer's way to communicate to other devs that the variable *shouldn't be* changed, not that it *isn't* changed in the current version of code. The developer's intention that a variable shouldn't be changed can't be inferred solely from static analysis of the code, unlike the variable's property of currently being unchanged.

Automatically replacing `let` with `const` results in the loss of the distinction between constants specifically marked as never-to-be-changed by a developer with variables that happen to be unchanged, but not inherently unchangeable.

For currently unchanged variables, the *prefer const* rule also introduces an unnecessary diff when the variable has to be reassigned in a later code change, by converting `const` to `let`. And since any `const` can now be easily switched to `let`, devs are deprived of a simple way to convey the meaning that a variable is not supposed to be modified.

To fix this, `let` should be preferred over `const` by default, with `const` reserved to things that devs decide shouldn't be changed.

---

🔹 One way to achieve this is using [`eslint-plugin-prefer-let`](https://www.npmjs.com/package/eslint-plugin-prefer-let).

🔹 Another way is to support the related [rule suggestion](https://github.com/biomejs/biome/discussions/5873) to Biome.
