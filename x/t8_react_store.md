---
title: Conjuring the minimal shared state setup in React
date: 2025-05-25
tags:
    - react
    - typescript
    - javascript
    - webdev
---

To figure out what a minimal shared state setup should look like, I'm starting off with a local state setup with React's `useState()`:

```jsx
let Counter = () => {
    let [count, setCount] = useState(0);

    let handleClick = useCallback(() => {
        setCount(value => value + 1);
    }, [setCount]);

    return <button onClick={handleClick}>{value}</button>;
};
```

If we come up with a similar shared state setup we'll have a short migration path from local state to shared state (like it often evolves), apart from sticking to a familiar pattern of managing state.

Let's move the initial state value to a shared location, that is to a React Context, to make the counter's initial value visible to other components:

```diff
+ // shared initial state
+ let AppContext = createContext(0);

  let Counter = () => {
-     let [count, setCount] = useState(0);
+     let [count, setCount] = useState(useContext(AppContext));

      let handleClick = useCallback(() => {
          setCount(value => value + 1);
      }, [setCount]);

      return <button onClick={handleClick}>{value}</button>;
  };
```

That's not a controllable shared state yet. The value from the Context only affects the initial value of the local state. The value setter `setCount()` doesn't affect the value in the Context and the updates aren't visible to other components reading the value from the Context.

If we make the shared initial state interactive, that is responsive to changes, effectively we'll turn it into the controllable shared state that we're after.

To achieve this, we're adding:
- a container for the initial state, let's call it a store, exposing a state setter (instead of manually adding a value setter to the Context),
- and a `useStore()` hook that will unpack the current state value from the store and subscribe the component to changes in the store in order to make the component responsive to these changes.

```diff
- // shared initial state
- let AppContext = createContext(0);
+ // controllable shared state
+ let AppContext = createContext(new Store(0));

  let Counter = () => {
-     let [count, setCount] = useState(useContext(AppContext));
+     let [count, setCount] = useStore(useContext(AppContext));

      let handleClick = useCallback(() => {
          setCount(value => value + 1);
      }, [setCount]);

      return <button onClick={handleClick}>{value}</button>;
  };
```

Conforming to the `useState()`'s API, the `useStore()` hook returns a state value setter `setCount` along with the current state value `count`. Note that apart from replacing the hook nothing else has changed in the component.

Now, calling `setCount()` updates the store state value, which is visible to all components subscribed to the store from `AppContext` with the `useStore()` hook, like the `Counter` component itself. The full-fledged shared state is set up!

With the store as a single intermediary, we've got a minimal shared state setup. Its close similarity to the local state setup with React's `useState()` makes it already familiar to React developers and streamlines the common task of migration from local state to shared state.

Based on this approach and its minimalist spirit, I created [`@t8/react-store`](https://t8.js.org/react-store). Its description covers its common use cases including a single-store and multistore setup (both being perfectly legit), filtering store state updates, and some live examples.
