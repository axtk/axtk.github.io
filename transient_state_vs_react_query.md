---
title: Setting up loading state in React: Transient State vs Tanstack React Query
date: 2025-05-06
updated: 2025-05-21
tags:
    - react
    - typescript
    - javascript
    - webdev
---

*[Foreword]({{site.github.baseurl}}/transient_state)*

Let's see what it takes to add the loading state tracking for an async action with Tanstack React Query and Transient State.

## Example 1

In this example, we've got an `<ItemList>` component that fetches its data with a predefined async action `fetchItems()`, and a `<Status>` component that shows the action's current loading state.

We'll assume that initially there was no loading state tracking, and we're adding it to the already existing code reflecting the successful scenario. For simplicity, the loaded data is stored locally, but it could be stored in some shared state instead.

### With Tanstack React Query

```diff
+ import {useQuery} from '@tanstack/react-query';

  const ItemList = () => {
-     const [items, setItems] = useState([]);
+     const {data: items, ...state} = useQuery({
+         queryKey: ['item-list'],
+         queryFn: fetchItems,
+     });
-
-     useEffect(() => {
-         fetchItems().then(setItems);
-     }, [fetchItems, withState]);

+     // ... rendering based on the async action's `state`

      return (
          <div className="item-list">
              <ul>{items.map(/* ... */)}</ul>
          </div>
      );
  };

  const Status = () => {
+     const state = useQuery({
+         queryKey: ['item-list'],
+         enabled: false,
+     });
+
+     return state.isPending ? 'Busy' : 'Done';
  }
```

In order to introduce the async action tracking with React Query, we've changed the entire `<ItemList>`'s setup. We don't need an explicit Effect in `<ItemList>` to run the async action any more. But it also means we have to explicitly turn it off by setting `enabled: false` if we don't need to run it, as in the `<Status>` component, or if we need to run it conditionally, like in the next example. Removing the Effect has in a way reversed the flow of our code (and reasoning): we now have to stop the async action from running if we don't need it right away in a component.

The data fetched in `<ItemList>` has moved from the component's (or app's) state to React Query, and should be manipulated with its hooks further on. Moving the app's state (or a part of it) to React Query might potentially affect other components interacting with it.

### With Transient State

```diff
+ import {useTransientState} from 'transient-state';

  const ItemList = () => {
      const [items, setItems] = useState([]);
+     const [state, withState] = useTransientState('item-list');

      useEffect(() => {
-         fetchItems().then(setItems);
+         withState(fetchItems()).then(setItems);
      }, [fetchItems, withState]);

+     // ... rendering based on the async action's `state`

      return (
          <div className="item-list">
              <ul>{items.map(/* ... */)}</ul>
          </div>
      );
  };

  const Status = () => {
+     const [state] = useTransientState('item-list');
+
+     return state.complete ? 'Done' : 'Busy';
  };
```

The async action state tracking with Transient State doesn't alter the structure of the code and doesn't affect the app's state, which means there's no need for major refactors to set it up.

## Example 2

Let's add a button to `<ItemList>` from the example above that refreshes the items. We'll also assume now that we've got an initial list of items, without an initial fetch.

### With Tanstack React Query

We've seen above that the React Query's `useQuery()` hook, used for the async action state tracking, automatically runs the action. We'll have to [disable it explicitly](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries) by setting `enabled: false` to run the async action conditionally, when the button is clicked.

```diff
+ import {useQuery} from '@tanstack/react-query';

  const ItemList = () => {
-     const [items, setItems] = useState(initialItems);
+     const {data: items, refetch, ...state} = useQuery({
+         queryKey: ['items'],
+         queryFn: fetchItems,
+         initialData: initialItems,
+         enabled: false,
+     });
-
-     const loadItems = useCallback(() => {
-         fetchItems().then(setItems);
-     }, [fetchItems]);

+     // ... rendering based on the async action's `state`

      return (
          <div className="item-list">
              <ul>{items.map(/* ... */)}</ul>
-             <p><button onClick={loadItems}>Refresh</button></p>
+             <p><button onClick={refetch}>Refresh</button></p>
          </div>
      );
  };
```

As in the Example 1, we refactored the entire component's setup, but in a somewhat different way: We mapped the initial state to an option of `useQuery()` and we now set `enabled` to `false` to prevent the async action from running automatically before the button is clicked.

As a side note, it's also worth mentioning that the React Query's core features (like caching) are unavailable when an async action has to be run conditionally (e.g. in response to a user action, by using `refetch()` returned from `useQuery()`, as shown in the example above)<sup>[[4](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries), [5](https://github.com/TanStack/query/discussions/5820#discussioncomment-9016843)]</sup>, which is a common scenario. This might obscure the point of introducing React Query.

### With Transient State

```diff
+ import {useTransientState} from 'transient-state';

  const ItemList = () => {
      const [items, setItems] = useState(initialItems);
+     const [state, withState] = useTransientState('item-list');

      const loadItems = useCallback(() => {
-         fetchItems().then(setItems);
+         withState(fetchItems()).then(setItems);
      }, [fetchItems, withState]);

      useEffect(() => loadItems(), [loadItems]);

+     // ... rendering based on the async action's `state`

      return (
          <div className="item-list">
              <ul>{items.map(/* ... */)}</ul>
              <p><button onClick={loadItems}>Refresh</button></p>
          </div>
      );
  };
```

The introduced changes are exactly the same as in the Example 1. And again the changes affected the code only tangentially. The Transient State setup is largely decoupled from the code it handles, which reduces cognitive load and makes the async action state tracking more transparent and maintainable.

## Summary

Tanstack React Query offers a way to track async actions' state as part of its feature set. As we saw above, the adoption of React Query requires careful context-dependent refactors. It also takes over the app's shared state (or a part of it), affecting the way components interact with the app's state.

When introducing a complex data fetching lib feels like an overkill, Transient State, as a small single-purpose lib, can offer a neat, minimalist way to set up the async action state tracking, either local or shared, without affecting the app's state.

<a href="https://github.com/axtk/transient-state" class="star-button" target="_blank">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height="16"><path d="M50,5 l14,28 l31,6 l-22,22 l7,34 l-30,-15 l-30,15 l7,-34 l-22,-22 l31,-6z" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
    Star Transient State
</a>
