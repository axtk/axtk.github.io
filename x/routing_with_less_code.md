---
title: Routing with less code in React
date: 2025-09-09
tags:
    - react
    - webdev
    - typescript
    - javascript
---

I was playing around with routing and found out that we can make the routing code more concise and more semantically clear than with many routers, if we carefully bring the idea that route-based rendering is a variety of conditional rendering into practice.

Here's an example:

```jsx
let Intro = () => (
  <main>
    <h1>Intro</h1>
  </main>
);

let Section = ({id}) => (
  <main>
    <h1>Section {id}</h1>
  </main>
);

let App = () => {
  let {withRoute} = useRoute();

  // `withRoute(routePattern, x, y)` acts similarly to
  // `matchesRoutePattern ? x : y`
  return (
    <>
      <nav className={withRoute('/', 'full', 'compact')}>
        <A href="/">Intro</A>{' '}
        <A href="/sections/1">Section 1</A>{' '}
        <A href="/sections/2">Section 2</A>
      </nav>
      {withRoute('/', <Intro/>)}
      {withRoute(/^\/sections\/(?<id>\w+)\/?$/, ({params}) => (
        <Section id={params.id}/>
      ))}
    </>
  );
};

hydrateRoot(document.querySelector('#app'), <App/>);
```

Even without going into detail, this code seems pretty easy to follow. And to write, too.

As a quick comparison, it's worth noting how much more code is required to get a very similar output with TanStack Router (and how more elaborate it is), according to its [docs](https://tanstack.com/router/latest/docs/framework/react/quick-start#using-code-based-route-configuration).

<!-- collapsible *View the TanStack Router code example from the TanStack docs* -->

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

<!-- endcollapsible -->

Let's have a closer look at our first code snippet.

As the comment in the code reads, `withRoute(routePattern, x, y)` is semantically similar to `matchesRoutePattern ? x : y`, following the conditional rendering pattern common with React code. It's concise and consistent with both components and prop values (like with `<Intro/>` and `className` in the example above). The file-based, component-based, and config-based approaches are focused on component rendering while prop values have to be handled differently, requiring another import and a bunch of extra lines of code.

Since `withRoute(routePattern, x, y)` is an ordinary stateless function, `withRoute()` calls aren't coupled together, they don't have to maintain a certain order, they don't have to be grouped in a single component (and they also can be, as in our small example above), like other conditional rendering. As straightforward as it is, the routing function `withRoute()` is also very flexible and fit for arbitrary route-based logic (more so than other approaches to routing).

Based on this approach, I created [`@t8/react-router`](https://github.com/t8js/react-router#readme). In fact, it explores the ways to make the routing code closer to common patterns and more intuitive in other aspects, too: with regard to the route link API, navigation API, SSR, lazy routes, URL parameters state, type safety. These topics are covered in more detail on [GitHub](https://github.com/t8js/react-router#readme).
