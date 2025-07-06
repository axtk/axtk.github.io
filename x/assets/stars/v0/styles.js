{

astro.CelestialSphere.styles.VAN_GOGH = {
    GRID_COLOR: '#5c3d99',
    // GRID_COLOR: graphics.color.toRGBA('#96f', .6),
    STAR_LABEL_COLOR: graphics.color.toRGBA('#96f', .5),
    CONSTELLATION_LABEL_COLOR: graphics.color.toRGBA('#96f', .15),
    // GRID_COLOR: graphics.color.toRGBA('#039', .25),
    // STAR_LABEL_COLOR: graphics.color.toRGBA('#96f', .4),
    // CONSTELLATION_LABEL_COLOR: graphics.color.toRGBA('#96f', .045),
    FACTORS: [2.5, .75],

    setStarStyle(g) {
        g.lineWidth = 1.5;
        g.lineCap = 'round';
    },
    drawStar(g, star, point) {
        let q = this.FACTORS, color = star[5];
        let radius = q[0]*(6.5 - star[3]), r = radius, R = 10;

        g.fillStyle = 'rgba(' + color + ',' + (radius > R ? .3 : .02) + ')';
        g.beginPath();
        g.arc(point[0], point[1], r, 0, 2*Math.PI);
        g.fill();

        g.fillStyle = 'rgba(' + color + ',' + Math.min(.08*(radius - 2), radius > R ? .6 : .2) + ')';
        g.beginPath();
        g.arc(point[0], point[1], r/2, 0, 2*Math.PI);
        g.fill();

        while (r > 0) {
            let startAngle = 2*Math.random()*Math.PI;

            g.strokeStyle = 'rgba(' + color + ',' + Math.min(.075*(radius - 1.5)*Math.random(), radius > R ? .7 : .2) + ')';
            // g.setLineDash([3 + 3*Math.random(), 6 + 6*Math.random()]);
            g.setLineDash([3 + 5*Math.random(), 6 + 10*Math.random()]);

            g.beginPath();
            g.arc(point[0], point[1], r, startAngle, startAngle + (1 + Math.random())*Math.PI);
            // g.arc(point[0], point[1], r, startAngle, startAngle + (0 + Math.random()/3)*Math.PI);
            g.stroke();
            r -= .5;
            // r -= 1; // r < 10 ? 1 : 1.5;
        }
    }
};

astro.CelestialSphere.styles.VAN_GOGH_2 = {
    GRID_COLOR: graphics.color.toRGBA('#039', .25),
    STAR_LABEL_COLOR: graphics.color.toRGBA('#96f', .4),
    CONSTELLATION_LABEL_COLOR: graphics.color.toRGBA('#96f', .045),
    FACTORS: [2.5, .75],

    drawStar(g, star, point) {
        let q = this.FACTORS, color = star[5];
        let radius = q[0]*(6.5 - star[3]), r = radius;

        g.fillStyle = 'rgba(' + color + ',.2)';
        g.beginPath();
        g.arc(point[0], point[1], r--, 0, 2*Math.PI);
        g.fill();

        while (r > 0) {
            let startAngle = 2*Math.random()*Math.PI;
            g.lineWidth = 3;
            g.lineCap = 'round';
            g.strokeStyle = 'rgba(' + color + ',' + (.1*(radius - 1)*Math.random()) + ')';
            g.beginPath();
            g.arc(point[0], point[1], r--, startAngle, startAngle + (.2 + .5*Math.random())*Math.PI);
            g.stroke();
        }
    }
};

}