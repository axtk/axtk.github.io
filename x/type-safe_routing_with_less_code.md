---
title: Type-safe routing with less code in React
date: 2025-09-12
update: 2026-02-02
tags:
    - react
    - webdev
    - typescript
    - javascript
---

In a [recent post](/x/routing_with_less_code), I had a code example showcasing a concise way to do routing in React. One of its features is a ternary routing function `at(route, x, y)` acting similarly to the ternary conditional operator `atRoute ? x : y` which works equally with components and prop values:

```jsx
<nav className={at("/", "full", "compact")}>
```

```jsx
{at("/", <Intro/>)}
{at(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
  <Section id={params.id}/>
))}
```

In this code, the `params` type has a generic shape of `Record<string, string | undefined>` of an object containing string portions of a string URL. It's sufficient in many cases, but sometimes we might wish for preciser typing. For example, in the code above, `params.id` matches the pattern of `\d+`, so it could be an actual number rather than a string.

The discussed approach to routing, in fact, allows for gradual adoption of stricter route typing by incrementally defining URL schemas scaling up from a single component to the entire app.

Let's define a URL schema for our code example to make sure that `params.id` is typed as a number, and the root URL doesn't accept any params at all:

```tsx
import { A, useRoute } from "@t8/react-router";
import { createURLSchema } from "url-shape";
import { z } from "zod";

const { url } = createURLSchema({
  "/sections/:id": z.object({
    // path placeholders
    params: z.object({
      id: z.coerce.number(),
    }),
    // similarly, a `query` schema can be added to a route,
    // if necessary
  }),
  "/": z.object({}), // goes without parameters
});

let App = () => {
  let { at } = useRoute();

  // `at(route, x, y)` acts similarly to `atRoute ? x : y`
  return (
    <>
      <nav className={at(url("/"), "full", "compact")}>
        <A href={url("/")}>
          Intro
        </A>{" "}
        <A href={url("/sections/:id", { params: { id: 1 } })}>
          Section 1
        </A>
      </nav>
      {at(url("/"), <Intro/>)}
      {at(url("/sections/:id"), ({ params }) => (
        <Section id={params.id}/>
      ))}
    </>
  );
};
```

Note that the shapes of the components and the routing function `at()` remain the same. All what's changed inside the component is that the `string` and `RegExp` URL patterns were replaced with the typed URL builder `url()`. It's using these typed route patterns that makes `params.id` to be now resolved as a number, and that the route shapes comply with the `zod`-powered URL schema. (Hover over `params` and `id` in the [sandbox example](https://codesandbox.io/p/sandbox/t8-react-router-type-safety-demo-vgt64k?file=%2Fsrc%2FApp.tsx) to see these types for yourself.)

Although not a requirement, we might want to cover the entire app with type-safe routes. Once we've done that, we might want to disallow plain `string` and `RegExp` URLs and URL patterns created outside the URL builder (the `url()` function) altogether to enforce type-safe routing further on. This can be done by overriding the router's type config in our app's code:

```ts
declare module "@t8/react-router" {
  interface Config {
    strict: true;
  }
}
```

But this is completely optional. Regardless of this setting, a URL schema doesn't have to be defined in a single place, there can be multiple partial URL schemas representing certain portions of the app. This incremental approach to type-safe routing, from a partial URL schema to strict application-wide type safety, makes it easier to adopt and maintain, without impairing the conciseness of the routing code.

This is essentially all what's required to set up type-safe routes with this pretty minimalist approach to routing. See also the [package overview](https://github.com/t8js/react-router#readme) for more details on its other aspects.
