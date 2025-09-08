---
title: Quick exercise of designing minimal shared state in React
date: 2025-05-25
updated: 2025-09-08
tags:
    - react
    - typescript
    - javascript
    - webdev
---

There are a number of state management libs described as minimal or bare-bones, but are they indeed? Let's run through this exercise and see how these libs match the minimal design. In fact, designing minimal shared state will require just a few steps.

First, we'll lift the initial value of the local state to a shared location:

```diff
  // non-interactive shared initial state
+ let AppContext = createContext(0);

  let Counter = () => {
    // local state, invisible to other components
-   let [count, setCount] = useState(0);
+   let [count, setCount] = useState(useContext(AppContext));

    // render
  };
```

The initial state value can now be seen by other components, but `setCount()` won't affect the shared value yet. To make the shared state interactive we can pack it into a container object, we'll call it a store, exposing a state setter, so we don't have to manually add a value setter to the Context. To unpack the state value from the store and subscribe to its changes inside the component we can add a `useStore()` hook. With the store and the hook, we'll get a full-fledged shared state setup:

```diff
  // full-fledged interactive shared state
+ let AppContext = createContext(new Store(0));

  let Counter = () => {
-   let [count, setCount] = useState(useContext(AppContext));
+   let [count, setCount] = useStore(useContext(AppContext));

    // render
  };
```

Now, calling `setCount()` will update the shared `count` value. Note how this shared state setup is similar to React's `useState()`: we've got the same API for reading and updating the `count` value.

With the store and the hook, we've got a minimal shared state setup that is also familiar and quick to migrate to from local state. If we're good with `useState()` for local state, `useStore()` can be just as good for shared state.

Compared to this setup, other approaches look more verbose. With Zustand, we're going to have something like the following, as suggested by the [docs](https://zustand.docs.pmnd.rs/getting-started/introduction):

```jsx
const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

const Controls = () => {
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
};
```

The Zustand approach is a bit concerning in its encouraging of mixing state and actions, which blurs the semantic boundary between the data and the behavior. In practice, the mixed state should require extra workarounds to make it serializable for SSR, and it carries around the entire action set while it can be never used to that extent in a particular component.

The minimal approach discussed above doesn't raise any of these concerns: the data in the store is clearly separated from behavior, and it's pretty straightforward with SSR. In this approach, the Zustand example can be very similar to a `useState()` setup:

```diff
+ const AppContext = createContext(new Store({bears: 0}));

  const Controls = () => {
-   const [state, setState] = useState({bears: 0});
+   const [state, setState] = useStore(useContext(AppContext));

    const increasePopulation = () => {
      setState(state => ({
        ...state,
        bears: state.bears + 1,
      }));
    };

    return <button onClick={increasePopulation}>one up</button>;
  };
```

Based on this approach and its minimalist spirit, I created [`@t8/react-store`](https://t8.js.org/react-store). It exports such `Store` and `useStore()` completing this exercise. In addition to the discussed, the package description covers its common use cases including a single-store and multistore setups (both being perfectly legit), filtering store state updates, and some live examples.
