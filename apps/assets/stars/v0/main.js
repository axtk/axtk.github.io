{

let screen = new graphics.canvas.AnimationScreen(document.querySelector('canvas'));
let q = 3;

let sphere = new astro.CelestialSphere(
    [screen.width/2, screen.height/2, 0],
    q*Math.min(screen.width/2, screen.height/2)
);

screen.adjust(context => {
    sphere.center = [screen.width/2, screen.height/2, 0];
    sphere.radius = q*Math.min(screen.width/2, screen.height/2);
    screen.clear();
    sphere.draw(context);
});

// sphere.rotate(0, 1.57).rotateBy(3.2, 0).rotateBy(0, -1.57).rotateBy(.5, 0); // Ursa Major
// sphere.rotate(0, 1.54).rotateBy(3.1, 0); // Orion
sphere.rotate(0, 1.54).rotateBy(3.1, -.15); // Orion
// sphere.rotate(0, 2.16).rotateBy(-.3, 0); // Scorpio

screen.addDraggable(sphere);
screen.adjust();

const MAX_TICKS = 1e4;

let started = new Promise((resolve, reject) => {
    let ticks = 0;
    let ticker = setInterval(() => {
        let busy = !sphere.stars || !sphere.stars.length;
        if (ticks === 1 && busy)
            document.body.classList.add('busy');
        if (ticks++ > MAX_TICKS || !busy) {
            document.body.classList.remove('busy');
            clearInterval(ticker);
        }
        if (ticks > MAX_TICKS && busy) reject();
        else if (!busy) resolve();
    }, 20);
});

let app = window.app = { screen, sphere, started };

if (graphics.touchesSupported) document.body.classList.add('touchable');

}