---
title: Uncluttered async action state tracking in React
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

Most ways to handle an async action's state are wired into complex libs either for data fetching (like TanStack React Query, RTK Query) or shared state management (like Redux Toolkit). Introducing such libs and adapting the code to them (and to some arguably clumsy patterns at times<sup>[[1](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)+[2](https://github.com/TanStack/query/discussions/5820#discussioncomment-9016843), [3](https://redux-toolkit.js.org/api/createAsyncThunk)]</sup>) require considerable rewrites and don't quite feel like adding lightweight scaffolding to the code. Sometimes adding one of these libs might just feel redundant.

In order to address my question, I ended up creating a small package called [`@t8/react-pending`](https://github.com/t8dev/react-pending). It helps track async actions' state without breaking into the async actions' code and the app's shared state (and even without requiring one), meaning that the async action tracking is easy to set up. The async action's state can be used either locally within a component or shared between multiple components equally easily. The package description outlines these and some other options in more detail.

## Related

- [Comparing loading state with T8 React Pending and TanStack React Query](/x/t8_react_pending_vs_react_query)
