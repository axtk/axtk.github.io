---
title: Managing URL parameters as state in&nbsp;React
date: 2025-09-17
update: 2025-09-28
tags:
    - react
    - webdev
    - typescript
    - javascript
---

Since URL parameters can be regarded as a portion of an app's state, it's only reasonable to think of managing them in the React way of managing state: similarly to `useState()`.

From this perspective, here's what handling the URL params state of, let's say, the root URL `/` would look like:

```diff
  export const App = () => {
-   let [{ coords }, setState] = useState({ coords: {} });
+   let [{ query }, setState] = useRouteState("/");

    let setPosition = () => {
      setState((state) => ({
        ...state,
-       coords: {
+       query: {
          x: Math.floor(100 * Math.random()),
          y: Math.floor(100 * Math.random()),
        },
      }));
    };

    return (
      <main>
-       <Shape x={coords.x} y={coords.y}/>
+       <Shape x={query.x} y={query.y}/>
        <p><button onClick={setPosition}>Move</button></p>
      </main>
    );
  };
```

The similarity of this code to the React's `useState()` setup makes it familiar right away and streamlines the migration from local state to the URL params state, so it looks like a way to go.

This perspective fits well with the minimalist approach to routing I outlined in a [recent post](/posts/routing_with_less_code). That's why the `useRouteState()` hook from the code above is part of this approach, so now we can turn this code into a [live demo](https://codesandbox.io/p/sandbox/sgvdfg?file=%252Fsrc%252FApp.tsx).

In this approach, the route state can also be handled with preciser typing by introducing a type-safe URL builder `url()` and a `zod`-powered URL schema (as described in [another post](/posts/type-safe_routing_with_less_code)), although it's completely optional:

```tsx
import { useRouteState } from "@t8/react-router";
import { createURLSchema } from "url-shape";
import { z } from "zod";

const { url } = createURLSchema({
  "/shapes/:id": {
    params: z.object({
      id: z.coerce.number(),
    }),
    query: z.optional(
      z.object({
        x: z.coerce.number(),
        y: z.coerce.number(),
      })
    ),
  },
});

export const ShapeSection = () => {
  let [{ params, query }, setState] = useRouteState(url("/shapes/:id"));

  let setPosition = () => {
    setState((state) => ({
      ...state,
      query: {
        x: Math.floor(100 * Math.random()),
        y: Math.floor(100 * Math.random()),
      },
    }));
  };

  let resetPosition = () => {
    setState({ params });
  };

  return (
    <main>
      <h1>Shape {params.id}</h1>
      <Shape x={query.x} y={query.y} n={params.id + 2}/>
      <p>
        <button onClick={setPosition}>Move</button>{" "}
        <button onClick={resetPosition}>Reset</button>
      </p>
    </main>
  );
};
```

[View live demo](https://codesandbox.io/p/sandbox/qnd87w?file=%252Fsrc%252FShapeSection.tsx)

Compared to the first example, we've essentially added a URL schema definition with `createURLSchema()` and replaced the fixed URL `"/"` passed to `useRouteState()` as a parameter with the typed URL pattern `url("/shapes/:id")`. These changes resulted in `params` and `query` being resolved with preciser typing (hover over them in the [playground](https://codesandbox.io/p/sandbox/qnd87w?file=%252Fsrc%252FShapeSection.tsx) to see their types match the schema). The structure of the code is still pretty much the same, with the route state handling equally similar to React's `useState()`.

---

This minimalist approach to routing extends beyond managing URL parameters, more of its aspects are covered in the [package overview](https://github.com/t8js/react-router#readme).

By the way, if you're wondering if global/shared state can be managed in the `useState()`-like manner as well, I've got a [post](/posts/designing_minimal_shared_state) on that, too.
