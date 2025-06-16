---
title: Painless type-safe routing in React
date: 2025-06-16
tags:
    - react
    - typescript
    - javascript
    - webdev
---

I was pretty excited to check out the [TanStack Router's approach](https://tanstack.com/blog/search-params-are-state) to routing type safety. The concept of securing the types of the routes and their parameters sounds nice even regardless of what the TanStack's implementation had to offer.

I'm not a huge fan of the constraints of the hierarchical route configs or route-based file structure, the opaque inheritance of parent route schemas by nested routes, the indirectness and clumsiness of the file-based route definition through a factory function promoted by TanStack. The several ways to mess up the type inference performance and the considerations to counter them covered in the [TanStack docs](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety) added to the slight discomfort with this particular approach. But the original concept looks cool nonetheless.

So I came up with another approach to type-safe routing in [Routescape](https://routescape.js.org). Among its objectives is keeping the APIs of route matching and link components simple, as well as enabling gradual adoption of type-safe routing throughout the app. The way to achieve this is to entrust route typing to an external type-safe URL builder, enabling the router to accept the values created by the URL builder with regard to the typing.

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

The URL schema (defined with Zod or Yup) is transparent and easy to follow, nothing is implied under the hood. The URL schema doesn't have to cover the entire app, the schema might be split into parts covering standalone portions of the app for better readability and maintainability.

The ternary route matching function `withRoute(routePattern, x, y)` passes the route types provided by the `url()` function to its parameters. A type-aware code editor expects `params.id` in `<h1>Section {params.id}</h1>` to be a `number`, just as the URL schema suggests.

Once we have covered the entire app with type-safe routes we might want to disallow plain `string` and `RegExp` URLs and URL patterns created outside the URL builder to enforce type-safe routing further on. This can be done by overriding the Routescape's type config:

```ts
declare module 'routescape' {
    interface Config {
        strict: true;
    }
}
```

This progressive and straightforward approach to type-safe routing adds to the neatness of Routescape.
