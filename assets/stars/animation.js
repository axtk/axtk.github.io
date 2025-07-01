{

let rotation = {
    current: [0, 0],
    step: [Math.PI/app.sphere.radius, .75*Math.PI/app.sphere.radius]
};

let spin = context => {
    app.sphere.rotate(
        rotation.current[0] += rotation.step[0],
        rotation.current[1] += rotation.step[1]
    );
    app.sphere.draw(context);
    if (rotation.current[0] > 2*Math.PI) rotation.current[0] -= 2*Math.PI;
    if (rotation.current[1] > 2*Math.PI) rotation.current[1] -= 2*Math.PI;
};

let moveForwards = context => {
    app.sphere.rotateBy(
        3*rotation.step[0],
        0
    );
    app.sphere.draw(context);
    if (rotation.current[0] > 2*Math.PI) rotation.current[0] -= 2*Math.PI;
    if (rotation.current[1] > 2*Math.PI) rotation.current[1] -= 2*Math.PI;
};

let moveBackwards = context => {
    app.sphere.rotateBy(
        -3*rotation.step[0],
        0
    );
    app.sphere.draw(context);
    if (rotation.current[0] > 2*Math.PI) rotation.current[0] -= 2*Math.PI;
    if (rotation.current[1] > 2*Math.PI) rotation.current[1] -= 2*Math.PI;
};

app.started.then(() => {
    setTimeout(() => {
        app.screen.animate(moveForwards, 60);
        setTimeout(() => {
            app.screen.stopAnimation();
            app.screen.animate(moveBackwards, 60);
            setTimeout(() => {
                app.screen.stopAnimation();
                app.screen.animate(moveForwards, 60);
                setTimeout(() => app.screen.stopAnimation(), 250);
            }, 500);
        }, 250);
    }, 1000);
});

}