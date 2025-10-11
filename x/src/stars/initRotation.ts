import type { Context } from "./Context";
import { getDimensions } from "./getDimensions";
import { hideMenu } from "./hideMenu";
import { render } from "./render";
import { state } from "./state";
import { toBounds } from "./toBounds";

const { PI, asin } = Math;

let busy = false;

function move(ctx: Context, dx: number, dy: number) {
  if (busy) return;

  busy = true;

  let { tilt } = ctx;
  let { r } = getDimensions(ctx);

  let dPhi = asin(dx / r);
  let dTheta = asin(dy / r);

  let nextPhi = tilt[0] + dPhi;
  let nextTheta = tilt[1] + dTheta;

  tilt[0] = toBounds(nextPhi);

  if (nextTheta >= -PI / 2 && nextTheta <= PI / 2) tilt[1] = nextTheta;

  requestAnimationFrame(() => {
    render(ctx);
    state.write("tilt", tilt);
    busy = false;
  });
}

export function initRotation(ctx: Context) {
  let { element } = ctx;

  let x0: number | null = null;
  let y0: number | null = null;
  let t0 = Date.now();

  function start(x: number, y: number) {
    hideMenu();
    x0 = x;
    y0 = y;
    busy = false;
  }

  function end(x: number, y: number) {
    busy = false;

    if (x0 !== null && y0 !== null) move(ctx, x - x0, y - y0);

    x0 = null;
    y0 = null;
  }

  function go(x: number, y: number) {
    let t = Date.now();

    if (x0 === null || y0 === null || t - t0 < 20) return;

    move(ctx, x - x0, y - y0);
    x0 = x;
    y0 = y;
    t0 = t;
  }

  let mouseHandler: ((event: MouseEvent) => void) | null = null;
  let touchHandler: ((event: TouchEvent) => void) | null = null;

  element.addEventListener("mousedown", (event) => {
    start(event.offsetX, event.offsetY);

    if (!mouseHandler && !touchHandler) {
      mouseHandler = (event) => {
        go(event.offsetX, event.offsetY);
      };
      element.addEventListener("mousemove", mouseHandler);
    }
  });

  element.addEventListener("mouseup", (event) => {
    end(event.offsetX, event.offsetY);

    if (mouseHandler) {
      element.removeEventListener("mousemove", mouseHandler);
      mouseHandler = null;
    }
  });

  element.addEventListener("touchstart", (event) => {
    start(event.changedTouches[0].pageX, event.changedTouches[0].pageY);

    if (!touchHandler && !mouseHandler) {
      touchHandler = (event) => {
        go(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
      };
      element.addEventListener("touchmove", touchHandler);
    }
  });

  element.addEventListener("touchend", (event) => {
    end(event.changedTouches[0].pageX, event.changedTouches[0].pageY);

    if (touchHandler) {
      element.removeEventListener("touchmove", touchHandler);
      touchHandler = null;
    }
  });
}
