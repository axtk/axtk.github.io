{

let graphics = window.graphics = window.graphics || {};
let E = graphics.event;

let Flexible = {
    setup(fixedSize) {
        this.adjust();
        if (!fixedSize) window.addEventListener('resize', () => this.adjust());
    },
    adjust(callback) {
        if (callback) this.adjustmentCallback = callback;
        else {
            this.canvas.style.width = '';
            this.canvas.style.height = '';

            // 2024-07-15 fixes blurry texts
            let ratio = window.devicePixelRatio || 1;
            let w = this.canvas.offsetWidth, h = this.canvas.offsetHeight;

            this.width = w;
            this.height = h;

            this.canvas.width = ratio*w;
            this.canvas.height = ratio*h;

            this.canvas.style.width = w + 'px';
            this.canvas.style.height = h + 'px';

            this.canvas.getContext('2d').scale(ratio, ratio);

            if (this.adjustmentCallback)
                window.requestAnimationFrame(() => this.adjustmentCallback(this.context));
        }
    }
};

let Draggable = {
    addDraggable(shape) {
        if (this.draggables)
            return this.draggables.push(shape);

        this.draggables = [shape];
        this.dragHandler = this.trackDrag.bind(this);

        E.onClickDown(this.canvas, this.dragHandler);
        this.canvas.dataset.draggable = true;
    },
    removeDraggable(shape) {
        if (!this.draggables) return;

        for (let i = this.draggables.length - 1; i >= 0; i--) {
            if (this.draggables[i] === shape) this.draggables.splice(i, 1);
        }

        if (!this.draggables.length && this.dragHandler)
            E.offClickStart(this.canvas, this.dragHandler);

        this.draggables = null;
        delete this.canvas.dataset.draggable;
    },
    trackDrag(event) {
        // preventing from following to the mouse events after touches
        if (event.touches) event.preventDefault();

        let point = this.getPoint(event);
        let dragTrackingTimeout;

        let track = event => {
            if (event.touches) event.preventDefault();

            let nextPoint = this.getPoint(event);
            let displacement = nextPoint.map((component, i) => component -= point[i]);

            window.requestAnimationFrame(() => {
                if (!this.draggables) return stop();
                if (dragTrackingTimeout) clearTimeout(dragTrackingTimeout);
                dragTrackingTimeout = setTimeout(() => {
                    this.draggables.forEach(draggable => {
                        if (draggable.controls(nextPoint) && draggable.dragBy(displacement))
                            draggable.draw(this.clear().context);
                    });
                    point = nextPoint;
                }, graphics.touchesSupported ? 100 : 0);
            });
        };

        let stop = event => {
            if (event.touches) event.preventDefault();
            E.offClickMove(this.canvas, track);
            E.offClickUp(this.canvas, stop);
            delete this.canvas.dataset.dragging;
        };

        E.onClickUp(this.canvas, stop);
        E.onClickMove(this.canvas, track);
        this.canvas.dataset.dragging = true;
    }
};

let Clickable = {
    addClickable(shape) {
        if (this.clickables)
            return this.clickables.push(shape);

        this.clickables = [shape];
        this.clickStartHandler = this.trackClickStart.bind(this);
        this.clickEndHandler = this.trackClickEnd.bind(this);

        E.onClickDown(this.canvas, this.clickStartHandler);
        E.onClickUp(this.canvas, this.clickEndHandler);
        this.canvas.dataset.clickable = true;
    },
    removeClickable(shape) {
        if (!this.clickables) return;

        for (let i = this.clickables.length - 1; i >= 0; i--) {
            if (this.clickables[i] === shape) this.clickables.splice(i, 1);
        }

        if (!this.clickables.length) {
            if (this.clickStartHandler)
                E.offClickDown(this.canvas, this.clickStartHandler);
            if (this.clickEndHandler)
                E.offClickUp(this.canvas, this.clickEndHandler);
        }

        this.clickables = null;
        delete this.canvas.dataset.clickable;
    },
    trackClickStart(event) {
        // preventing from following to the mouse events after touches
        if (event.touches) event.preventDefault();
        this.clickStart = performance.now();
    },
    trackClickEnd(event) {
        if (event.touches) event.preventDefault();
        let releasedQuickly = performance.now() - this.clickStart < 250;
        let point = this.getPoint(event);

        /*
        app.screen.context.strokeStyle = 'blue';
        app.screen.context.beginPath();
        app.screen.context.arc(point[0], point[1], 7, 0, 2*Math.PI);
        app.screen.context.stroke();
        */

        window.requestAnimationFrame(() => {
            if (!releasedQuickly || !this.clickables) return;
            this.clickables.forEach(clickable => {
                if (clickable.controls(point) && clickable.point(point))
                    clickable.draw(this.clear().context);
            });
        });
    }
};

let Animated = {
    animate(action, fps) {
        let fx;
        if (fps) {
            fx = () => {
                this.clear();
                action(this.context);
                clearTimeout(this.timeout);
                this.animationTimeout = setTimeout(() => {
                    this.animationId = window.requestAnimationFrame(fx);
                }, 1000/fps);
            };
        }
        else {
            fx = () => {
                this.clear();
                action(this.context);
                this.animationId = window.requestAnimationFrame(fx);
            };
        }
        this.animationId = window.requestAnimationFrame(fx);
    },
    stopAnimation() {
        clearTimeout(this.animationTimeout);
        if (this.animationId) window.cancelAnimationFrame(this.animationId);
    }
};


let Screen = function(canvas, fixedSize) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.setup(fixedSize);
};

Object.assign(Screen.prototype, {
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
        return this;
    },
    getPoint(event) {
        let box = this.canvas.getBoundingClientRect();
        if (event.targetTouches && event.targetTouches.length)
            event = event.targetTouches[0];
        else if (event.changedTouches && event.changedTouches.length)
            event = event.changedTouches[0];
        return [event.clientX - box.left, event.clientY - box.top];
    }
}, Flexible, Draggable, Clickable);


let AnimationScreen = function() {
    Screen.apply(this, arguments);
};

Object.assign(AnimationScreen.prototype, Screen.prototype, Animated);

graphics.canvas = {
    Screen, AnimationScreen,
    Flexible, Draggable, Clickable, Animated
};

}