---
title: Type-safe routing with Routescape
date: 2025-06-16
tags:
    - react
    - typescript
    - javascript
    - webdev
---

[Routescape](https://routescape.js.org) offers type-safe routing as an optional enhancement. It allows for gradual adoption of type-safe routing throughout the app, while keeping the routing simple. It's achieved by entrusting route typing to an external type-safe URL builder and by enabling the router to accept the values created by the URL builder with regard to the typing.

Here's an example:

```tsx
import {A, useRoute} from 'routescape';
import {createURLSchema} from 'url-shape';
import {z} from 'zod';

const {url} = createURLSchema({
    '/': null, // goes without parameters
    '/sections/:id': {
        params: z.object({
            id: z.coerce.number(),
        }),
    },
    '/search': {
        query: z.object({
            term: z.string(),
            lang: z.optional(z.enum(['current', 'all'])),
        }),
    },
});

let App = () => {
    let [route, withRoute] = useRoute();

    // `withRoute(routePattern, x, y)` acts similarly to
    // `matchesRoutePattern ? x : y`
    return (
        <>
            <header className={withRoute(url('/'), 'full', 'compact')}>
                <h1>App</h1>
                <nav>
                    <A href={url('/')}>
                        Intro
                    </A>
                    {' | '}
                    <A href={url('/sections/:id', {params: {id: 1}})}>
                        Start
                    </A>
                </nav>
            </header>
            {withRoute(url('/'), (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(url('/sections/:id'), ({params}) => (
                <main>
                    <h1>Section {params.id}</h1>
                </main>
            ))}
        </>
    );
};
```

[Live demo](https://codesandbox.io/p/sandbox/little-moon-393y94?file=%2Fsrc%2FApp.tsx)

The URL schema (defined with Zod or Yup) is transparent and easy to follow, nothing is implied under the hood, no opaquely inherited parameters. The URL schema doesn't have to cover the entire app, the schema can be split into parts covering standalone portions of the app for better readability and maintainability.

The ternary route matching function `withRoute(routePattern, x, y)` passes the route types provided by the `url()` function to its parameters. A type-aware code editor expects `params.id` in `<h1>Section {params.id}</h1>` to be a `number`, just as the URL schema suggests.

Once we have covered the entire app with type-safe routes we might want to disallow plain `string` and `RegExp` URLs and URL patterns created outside the URL builder to enforce type-safe routing further on. This can be done by overriding the Routescape's type config:

```ts
declare module 'routescape' {
    interface Config {
        strict: true;
    }
}
```

The Routescape's incremental approach to type-safe routing, from a partial URL schema to strict application-wide type safety, makes it easier to adopt and maintain.
