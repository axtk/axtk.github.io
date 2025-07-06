---
title: A React router to my liking
date: 2025-05-17
updated: 2025-05-23
tags:
    - react
    - typescript
    - javascript
    - webdev
---

Here's the story why I bothered to create [Routescape](https://github.com/axtk/routescape), a React router to my liking.

I want simplicity:

## Single route matching format for everything

There are often several uninterchangeable ways to match a route pattern against the current location within a single router lib:

- declarative for components: with a component like `<Route>`, a config, or a certain file structure;
- imperative for props and other values: with a utility hook like `useMatch()` or `useMatchRoute()`;
- mixed for active links: with specifically designed components like `<NavLink>` and/or props like `className={({isActive}) => {...}}` or {% raw %}`activeProps={{...}}`{% endraw %}.

Meanwhile, route-based rendering essentially falls under the category of conditional rendering. It can be expressed with something similar to the ternary conditional operator `matchesRoutePattern ? x : y`, commonly used with conditional rendering. Since route matching involves some more complex subtleties (like applying route matching parameters to the returned value), we're going with the ternary function `withRoute(routePattern, x, y)` maintaining the semantics similar to the ternary conditional operator.

The ternary route-matching function, as simple as it is, can handle all three cases listed above in a single manner. Without imposing any specific route structure or hierarchy in advance, keeping routes decoupled from each other by default, since `withRoute()` can be used with any route pattern anywhere in the app's components. Which is an advantage, since routes and route-specific logic can be pretty arbitrary sometimes, breaking with a route hierarchy you might have designed.

```jsx
import {useRoute} from 'routescape';

let App = () => {
    let {route, withRoute} = useRoute();

    // `withRoute(routePattern, x, y)` acts similarly to
    // `matchesRoutePattern ? x : y`
    return (
        <>
            <header className={withRoute('/', 'full', 'compact')}>
                <h1>App</h1>
            </header>
            {withRoute('/', (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(/^\/section\/(?<id>\d+)\/?$/, ({params}) => (
                <main>
                    <h1>Section #{params.id}</h1>
                </main>
            ))}
        </>
    );
};
```

## Similarity to native APIs

That's about simplicity, too. It might seem a minor thing, but similar APIs for similar things considerably reduce cognitive load, the effort of repeatedly consulting the docs and migrating from the native APIs.

All web devs are already familiar with `<a href="/x">` and `window.location`. So, instead of introducing a unique `<Link to={...}>` and `navigate(...)`, Routescape sticks to the familiar APIs and carries them over to SPA navigation:

```diff
+ import {A, useRoute} from 'routescape';

  let UserNav = ({signedIn}) => {
+     let {route} = useRoute();

      let handleClick = () => {
-         window.location.assign(signedIn ? '/profile' : '/login');
+         route.assign(signedIn ? '/profile' : '/login');
      };

      return (
          <nav>
-             <a href="/">Home</a>
+             <A href="/">Home</A>
              <button onClick={handleClick}>Profile</button>
          </nav>
      );
  };
```

## Straightforward routing middleware

To cover the common app's needs, Routescape offers two middleware hooks `useNavigationStart()` and `useNavigationComplete()` to define actions to be done before and after the route navigation occurs:

```jsx
import {useNavigationComplete, useNavigationStart} from 'routescape';

function setTitle(href) {
    if (href === '/intro')
        document.title = 'Intro';
}

let App = () => {
    let [hasUnsavedChanges, setUnsavedChanges] = useState(false);

    let checkUnsavedChanges = useCallback(() => {
        if (hasUnsavedChanges)
            return false; // prevents navigation
    }, [hasUnsavedChanges]);

    useNavigationStart(checkUnsavedChanges);
    useNavigationComplete(setTitle);

    return (
        // app content
    );
};
```

## Straightforward SSR

For server-side rendering (SSR) or tests (without a global URL location object), the Routescape's `<Router location={url}>` component can be used as a React Context provider defining the current URL location for nested components. It can be used in the client-side code too, but it won't be necessary most of the times, if the app is OK with the URL provided by `window.location`.

## Straightforward lazy routes

The most direct way to set up lazy routing (that is loading the route content on demand) is a combination of route matching + React's code splitting (with `React.lazy()`, `<Suspense>`, and a code-splitting build tool). Routescape's route matching fits just fine.

```diff
+ import {Suspense} from 'react';
  import {useRoute} from 'routescape';
- import {Projects} from './Projects';
+ import {Projects} from './Projects.lazy';

  export const App = () => {
      let {withRoute} = useRoute();

      return (
          <>
              // ...
              {withRoute('/projects', (
-                 <Projects/>
+                 <Suspense fallback={<p>Loading...</p>}>
+                     <Projects/>
+                 </Suspense>
              ))}
          </>
      );
  };
```

```diff
+ // Projects.lazy.js
+ import {lazy} from 'react';
+
+ export const Projects = lazy(() => import('./Projects'));
```

## Converting HTML links to SPA route links

Sometimes a React app has to deal with static HTML content (e.g. fetched from the server) that can contain plain HTML links. It can be desirable to turn them to SPA route links. Since these links are not part of JSX, the route link component can't be easily used there. In this case, the Routescape's `useRouteLinks()` hook can be helpful:

```jsx
import {useRef} from 'react';
import {useRouteLinks} from 'routescape';

let Content = ({value}) => {
    let containerRef = useRef(null);

    useRouteLinks(containerRef, '.content a');

    return (
        <div ref={containerRef}>
            {value}
        </div>
    );
};
```

~

These features make up the point of Routescape. It's simple and lightweight, and specifically created to manage routing in a React app in a straightforward manner.

## Related

- [Type-safe routing with Routescape]({{site.github.baseurl}}/routescape_type_safety)
- [Type-safe URL parameters in Routescape]({{site.github.baseurl}}/routescape_typed_URL_parameters)
