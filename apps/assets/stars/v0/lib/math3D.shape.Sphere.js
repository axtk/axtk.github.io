{

let math3D = window.math3D = window.math3D || {};
if (!math3D.shape) math3D.shape = {};

const VERTICAL_FLIP = math3D.transform.getRotation(2, Math.PI);

let Sphere = function(center, radius) {
    this.center = center;
    this.radius = radius;
    this.rotate(0, 0);
};

Object.assign(Sphere.prototype, {
    draw(g) {
        this.drawGrid(g);
    },
    setGridStyle(g) {
        g.strokeStyle = 'black';
        g.lineWidth = .2;
    },
    drawGrid(g) {
        let r = this.radius, step = Math.PI/18;
        let point, prevPoint;

        this.setGridStyle(g);

        // longitudes
        for (let phi = 0; phi < 2*Math.PI - step/2; phi += step) {
            g.beginPath();
            for (let theta = 0; theta < Math.PI + step/8; theta += step/4) {
                point = this.transform({ r, phi, theta });
                if (this.visible(g, point)) g.moveTo(point[0], point[1]);
                if (prevPoint && this.visible(g, prevPoint))
                    g.lineTo(prevPoint[0], prevPoint[1]);
                prevPoint = point;
            }
            g.stroke();
            prevPoint = null;
        }

        // latitudes
        for (let theta = 0; theta < Math.PI + step/2; theta += step) {
            g.beginPath();
            for (let phi = 0; phi < 2*Math.PI + step/8; phi += step/4) {
                point = this.transform({ r, phi, theta });
                if (this.visible(g, point)) g.moveTo(point[0], point[1]);
                if (prevPoint && this.visible(g, prevPoint))
                    g.lineTo(prevPoint[0], prevPoint[1]);
                prevPoint = point;
            }
            g.stroke();
            prevPoint = null;
        }
    },
    rotate(phi, theta) {
        this.rotation = math3D.transform.multiply(
            math3D.transform.getRotation(0, theta),
            math3D.transform.getRotation(1, phi),
            VERTICAL_FLIP
        );
        return this;
    },
    rotateBy(phi, theta) {
        this.rotation = math3D.transform.multiply(
            math3D.transform.getRotation(0, theta),
            math3D.transform.getRotation(1, phi),
            this.rotation
        );
        return this;
    },
    transform(polar) {
        let point = math3D.transform.toCartesian(polar);
        point = math3D.transform.multiply(point, this.rotation);
        point = math3D.transform.add(point, this.center);
        return point;
    },
    visible(g, point) {
        let visible = point[2] >= 0 || this.transparent;
        if (!visible || !g.canvas) return visible;

        let w = g.canvas.width, h = g.canvas.height;
        return (
            point[0] > -.1*w && point[0] < 1.1*w &&
            point[1] > -.1*h && point[1] < 1.1*h
        );
    },
    toSurface(point) {
        let r = this.radius, sqZ = r*r;
        for (let i = 0; i < 2; i++)
            sqZ -= (point[i] - this.center[i])*(point[i] - this.center[i]);
        point[2] = Math.sqrt(sqZ) + this.center[2];
        return point;
    },
    controls(point) {
        let sqDistance = 0, controlledRadius = this.radius + 1;
        if (point.length === 2) point = this.toSurface(point);
        for (let i = 0; i < 3; i++)
            sqDistance += (point[i] - this.center[i])*(point[i] - this.center[i]);
        return sqDistance <= controlledRadius*controlledRadius;
    },
    dragBy(displacement) {
        let q = .25*Math.PI/this.radius;
        this.rotateBy(q*displacement[0], -q*displacement[1]);
        return true; // requires repaint
    },
    point(point) {
        return false; // doesn't require repaint
    }
});

math3D.shape.Sphere = Sphere;

}