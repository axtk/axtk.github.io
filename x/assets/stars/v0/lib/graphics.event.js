{

let graphics = window.graphics = window.graphics || {};
let touchesSupported = graphics.touchesSupported = 'ontouchstart' in window;

graphics.event = {
    onClickDown(target, handler) {
        target.addEventListener('touchstart', handler);
        target.addEventListener('mousedown', handler);
    },
    onClickMove(target, handler) {
        target.addEventListener('touchmove', handler);
        target.addEventListener('mousemove', handler);
    },
    onClickUp(target, handler) {
        target.addEventListener('touchend', handler);
        target.addEventListener('mouseup', handler);
    },
    offClickDown(target, handler) {
        target.removeEventListener('touchstart', handler);
        target.removeEventListener('mousedown', handler);
    },
    offClickMove(target, handler) {
        target.removeEventListener('touchmove', handler);
        target.removeEventListener('mousemove', handler);
    },
    offClickUp(target, handler) {
        target.removeEventListener('touchend', handler);
        target.removeEventListener('mouseup', handler);
    }
};

graphics.Event = touchesSupported ?
    { TOUCH_START: 'touchstart', TOUCH_MOVE: 'touchmove', TOUCH_END: 'touchend' } :
    { TOUCH_START: 'mousedown',  TOUCH_MOVE: 'mousemove', TOUCH_END: 'mouseup'  };

}