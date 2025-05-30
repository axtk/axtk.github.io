---
title: Unobtrusive async action state tracking in React
date: 2025-05-06
updated: 2025-05-21
tags:
    - react
    - typescript
    - javascript
    - webdev
---

Tracking the loading state, or an asynchronous action's pending state, is very common to React apps. In the UI and in the code, it's mostly about handling the secondary paths (like showing a process indicator or an error message) on top of the main successful scenario.

The question is: Can async action state handling actually feel like setting up auxiliary scaffolding to the code of the successful scenario without much affecting it? In a way, like JS error handling with `try...catch`: it is agnostic of the code it handles and it can be easily added to the code of a successful case at any stage of the application development without major changes.

Most ways to handle an async action's state are wired into complex libs either for data fetching (like Tanstack React Query, RTK Query) or shared state management (like Redux Toolkit). Introducing such libs and adapting the code to them (and to some arguably clumsy patterns at times<sup>[[1](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)+[2](https://github.com/TanStack/query/discussions/5820#discussioncomment-9016843), [3](https://redux-toolkit.js.org/api/createAsyncThunk)]</sup>) require considerable rewrites and don't quite feel like adding lightweight scaffolding to the code. Sometimes adding one of these libs might just feel redundant.

In order to address my question, I ended up creating a small package called [*Transient State*](https://github.com/axtk/transient-state). It helps track async actions' state without breaking into the async actions' code and the app's shared state (and even without requiring one), meaning that the async action tracking is easy to set up. The async action's state can be used either locally within a component or shared between multiple components equally easily. The package description outlines these and some other options in more detail, but the following examples will show its essential parts.

<a href="https://github.com/axtk/transient-state" class="star-button" target="_blank">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height="16"><path d="M50,5 l14,28 l31,6 l-22,22 l7,34 l-30,-15 l-30,15 l7,-34 l-22,-22 l31,-6z" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    Star Transient State
</a>

*[Comparing loading state with Transient State and Tanstack React Query]({{site.github.baseurl}}/transient_state_vs_react_query)*
