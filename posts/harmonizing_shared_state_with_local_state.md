---
title: Harmonizing shared state with local state in React
date: 2025-10-25
tags:
    - shortread
    - react
    - webdev
    - typescript
    - javascript
---

The split between the mental models of local and shared state management in React apps has been around since time immemorial. Here's an example of how to do these conceptually similar things in a very similar way:

```diff
+ import { Store, useStore } from "@t8/react-store";
+
+ let counterStore = new Store(0);

  let Counter = () => {
-   let [counter, setCounter] = useState(0);
+   let [counter, setCounter] = useStore(counterStore);

    let handleClick = () => {
      setCounter(value => value + 1);
    };

    return <button onClick={handleClick}>+ {counter}</button>;
  };

  let ResetButton = () => {
-   let [, setCounter] = useState(0);
+   let [, setCounter] = useStore(counterStore, false);

    let handleClick = () => {
      setCounter(0);
    };

    return <button onClick={handleClick}>×</button>;
  };

  let App = () => <><Counter/>{" "}<ResetButton/></>;
```

This is a full-fledged shared state setup. Similar handling of local and shared state means a short migration path from one to another without tedious refactors.

More details on this package can be found in [its concise overview](https://github.com/t8js/react-store#readme).
