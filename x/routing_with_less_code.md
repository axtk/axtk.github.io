---
title: Routing with less code in React
date: 2025-09-09
update: 2025-12-21
tags:
    - react
    - webdev
    - typescript
    - javascript
---

The React routers I see here and there leave me wondering: can we actually bring into practice the idea that route-based rendering is a variety of conditional rendering, similar to this:

```jsx
{atRoute ? x : y}
{atRoute && x}
```

It would work the same way with components and prop values, and it would make the routing code more concise and semantically clear compared to what routers tend to offer. After playing around with this idea, I still believe it's a way to go.

Here's an example of what I came up with:

```jsx
let App = () => {
  let { at } = useRoute();

  return (
    <>
      <nav className={at("/", "full", "compact")}>
        <A href="/">Intro</A>{" "}
        <A href="/sections/1">Section 1</A>{" "}
        <A href="/sections/2">Section 2</A>
      </nav>
      {at("/", <Intro/>)}
      {at(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <Section id={params.id}/>
      ))}
    </>
  );
};

createRoot(document.querySelector("#app")).render(<App/>);
```

I'm using a ternary routing function `at(route, x, y)` as a close semantic equivalent to the ternary conditional operator `atRoute ? x : y`. The function allows to omit the fallback parameter `y` when it's effectively `undefined` (as in `at("/", <Intro/>)` in the example above) and to pass route parameters to dynamic values (like with `<Section id={params.id}/>`).

Even without going into detail, this code seems pretty easy to follow. And to write, too.

As a quick comparison, it's worth noting how much more code is required to get a very similar output with TanStack Router (and how more elaborate it is), according to its [docs](https://tanstack.com/router/latest/docs/framework/react/quick-start#using-code-based-route-configuration).

<details>
<summary>View the TanStack Router code example from the TanStack docs</summary>

```tsx
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div className="p-2">Hello from About!</div>
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
```

</details>

As seen from our first code snippet, the route-matching function `at(route, x, y)` also works the same way with both components and prop values (like with `<Intro/>` and the `<nav>`'s `className`). By contrast, the file-based, component-based, and config-based approaches are focused on component rendering while prop values have to be handled differently.

Since `at(route, x, y)` is an ordinary stateless function, `at()` calls aren't coupled together, they don't have to maintain a certain order, they don't have to be grouped in a single component (and they also can be, as in our small example above), pretty much like any other conditional rendering. This makes the routing function `at()` very flexible and fit for arbitrary route-based logic (more so than other approaches to routing).

Based on this approach, I created [`@t8/react-router`](https://github.com/t8js/react-router#readme). With all its minimalism and straightforwardness, it brings the routing code closer to common patterns and makes it more intuitive in other aspects, too: with regard to the route link API, navigation API, SSR, lazy routes, URL parameters state, type safety. These topics are covered in more detail in the [package overview](https://github.com/t8js/react-router#readme).
