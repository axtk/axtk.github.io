---
title: Lightweight pending state handling in&nbsp;React
date: 2025-09-09
update: 2025-10-15
tags:
    - react
    - webdev
    - typescript
    - javascript
---

Managing loading state is very common to React apps, but how do we track an async action's state without bringing in a complex lib and major code rewrites?

It would be nice to handle the pending and error states of an async action without rearranging its code and without affecting the existing app's state management, and yet with a clear way to share the action's state with multiple components, when necessary.

To address this task I created a small package called [`@t8/react-pending`](https://github.com/t8js/react-pending#readme). Here's what it looks like in the code:

```diff
+ import { usePendingState } from "@t8/react-pending";

  export let ItemList = () => {
    let [items, setItems] = useState([]);
+   let { initial, pending, error, track } = usePendingState("fetch-items");

    useEffect(() => {
-     fetchItems().then(setItems);
+     track(fetchItems()).then(setItems);
    }, [fetchItems, track]);

+   if (initial || pending) return <p>Loading...</p>;
+   if (error) return <p>An error occurred</p>;

    return <ul>{items.map(/* ... */)}</ul>;
  };
```

```diff
+ import { usePendingState } from "@t8/react-pending";

  export let Status = () => {
+   let { initial, pending, error } = usePendingState("fetch-items");

    if (initial) return null;
    if (pending) return <>Busy</>;
    if (error) return <>Error</>;

    return <>OK</>;
  };
```

Note that the added code doesn't alter the structure of the successful path in the `ItemList`'s internals. The interaction with the component state is also intact. In our example, the data is stored in local state, but it could be stored elsewhere, similarly without being affected by the loading state handling.

The string parameter of the `usePendingState()` hook assigns a unique key to the particular state that can be used inside other components to refer to that state (like in `Status` in the example above). When the pending state is only required within a single component, we can just omit the hook's parameter.

So when introducing a complex data fetching lib feels redundant, this small single-purpose lib, can offer a neat, minimalist way to set up the async action state handling, either local or shared, without affecting the app's state.
