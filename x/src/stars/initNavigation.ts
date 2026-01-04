import type { Context } from "./Context.ts";
import { getDimensions } from "./getDimensions.ts";
import { hideMenu } from "./hideMenu.ts";
import { render } from "./render.ts";
import { state } from "./state.ts";
import { toBounds } from "./toBounds.ts";

const { PI, asin } = Math;

let nextMove: number | null = null;

function move(ctx: Context, dx: number, dy: number) {
  if (nextMove !== null) cancelAnimationFrame(nextMove);

  let { tilt } = ctx;
  let { r } = getDimensions(ctx);

  let dPhi = asin(dx / r);
  let dTheta = asin(dy / r);

  let nextPhi = tilt[0] + dPhi;
  let nextTheta = tilt[1] + dTheta;

  tilt[0] = toBounds(nextPhi);

  if (nextTheta >= -PI / 2 && nextTheta <= PI / 2) tilt[1] = nextTheta;

  nextMove = requestAnimationFrame(() => {
    render(ctx);
  });
}

export function initNavigation(ctx: Context) {
  let { element: container } = ctx;

  let x0: number | null = null;
  let y0: number | null = null;
  let t0 = Date.now();

  function start(x: number | undefined, y: number | undefined) {
    if (x === undefined || y === undefined) return;

    hideMenu();
    x0 = x;
    y0 = y;
    t0 = Date.now();
  }

  function stop(x: number | undefined, y: number | undefined) {
    if (x === undefined || y === undefined) return;
    if (x0 !== null && y0 !== null) move(ctx, x - x0, y - y0);

    end();
  }

  function end() {
    ctx.moving = false;

    x0 = null;
    y0 = null;

    requestAnimationFrame(() => {
      state.write("tilt", ctx.tilt);
      // render with `ctx.moving = false`
      render(ctx);
    });
  }

  function go(x: number | undefined, y: number | undefined) {
    if (x === undefined || y === undefined) return;

    let t = Date.now();

    if (x0 === null || y0 === null || t - t0 < 100) return;

    if (!ctx.moving) ctx.moving = true;

    move(ctx, x - x0, y - y0);
    x0 = x;
    y0 = y;
    t0 = t;
  }

  let mouseHandler: ((event: MouseEvent) => void) | null = null;
  let touchHandler: ((event: TouchEvent) => void) | null = null;

  container.addEventListener("mousedown", (event) => {
    start(event.offsetX, event.offsetY);

    if (!mouseHandler) {
      mouseHandler = (event) => {
        event.preventDefault();
        go(event.offsetX, event.offsetY);
      };
      container.addEventListener("mousemove", mouseHandler);
    }
  });

  container.addEventListener("mouseup", (event) => {
    if (!mouseHandler) return;

    stop(event.offsetX, event.offsetY);
    container.removeEventListener("mousemove", mouseHandler);
    mouseHandler = null;
  });

  container.addEventListener("touchstart", (event) => {
    start(event.touches[0]?.pageX, event.touches[0]?.pageY);

    if (!touchHandler) {
      touchHandler = (event) => {
        event.preventDefault();
        go(event.touches[0]?.pageX, event.touches[0]?.pageY);
      };
      container.addEventListener("touchmove", touchHandler);
    }
  });

  container.addEventListener("touchend", (event) => {
    if (!touchHandler) return;

    stop(event.touches[0]?.pageX, event.touches[0]?.pageY);
    container.removeEventListener("touchmove", touchHandler);
    touchHandler = null;
  });

  container.addEventListener("touchcancel", (event) => {
    if (!touchHandler) return;

    stop(event.touches[0]?.pageX, event.touches[0]?.pageY);
    container.removeEventListener("touchmove", touchHandler);
    touchHandler = null;
  });

  let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

  container.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (!ctx.moving) {
      ctx.moving = true;
      hideMenu();
    }

    if (wheelTimeout) clearTimeout(wheelTimeout);

    if (event.shiftKey) move(ctx, -event.deltaY, -event.deltaX);
    else move(ctx, -event.deltaX, -event.deltaY);

    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
      end();
    }, 250);
  });
}
