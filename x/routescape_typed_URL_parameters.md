---
title: Type-safe URL parameters in Routescape
date: 2025-06-23
tags:
    - react
    - typescript
    - javascript
    - webdev
---

URL parameters are commonly used to reflect a piece of the application state. The example below shows how to manipulate the URL state similarly to React's `useState()` in a type-safe manner with the [Routescape](https://routescape.js.org)'s `useRouteState()` hook.

The following example starts with a URL schema definition via `url-shape` and `zod` to set up a reference frame for type-safe routing. (More details on that in the [type-safe routing overview](/x/routescape_type_safety).)

```ts
import {A, useRouteState} from 'routescape';
import {createURLSchema} from 'url-shape';
import {z} from 'zod';

const {url} = createURLSchema({
    '/shape/:id': {
        params: z.object({
            id: z.coerce.number(),
        }),
        query: z.optional(
            z.object({
                x: z.coerce.number(),
                y: z.coerce.number(),
            }),
        ),
    },
});
```

Once we've defined the URL schema, with the route pattern and allowed path components and query parameters, we're proceeding to the component making use of the typed URL state based on this schema.

```tsx
export const ShapeSection = () => {
    let [{params, query}, setState] = useRouteState(url('/shape/:id'));

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
        setState({params});
    };

    return (
        <section>
            <h1>Shape {params.id}</h1>
            <Shape x={query.x} y={query.y}/>
            <p>
                <button onClick={setPosition}>Set position</button>
                {' '}
                <button onClick={resetPosition}>Reset position</button>
            </p>
            <nav>
                <A href="/">Intro</A>
                {' | '}
                <A href={url('/shape/:id', {params: {id: params.id + 1}})}>
                    Next shape →
                </A>
            </nav>
        </section>
    );
};
```

[Live demo](https://codesandbox.io/p/sandbox/tqdqln?file=%2Fsrc%2FShapeSection.tsx)

This example shows how Routescape's `useRouteState()` follows the familiar pattern of React's `useState()`: both return a tuple of `[state, setState]`, with `setState()` accepting either a fixed state value or an updater function. (Which also allows for quick migration from local state to URL state, if need be.)

`useRouteState()` can be used with an untyped fixed `string` route, skipping the schema definition part and assuming general types of URL parameters. With a type-safe URL builder like the `url()` function in the example above we're getting a more refined, typed URL state.

## Related

- [Type-safe routing with Routescape](/x/routescape_type_safety)
- [A React router to my liking](/x/routescape)
