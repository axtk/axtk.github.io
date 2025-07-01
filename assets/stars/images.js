{

let anchor = sphere.transform({ r: app.sphere.radius, phi: 0, theta: 0 });
let image = new Image();
image.onload = () => {
    app.screen.context.drawImage(image, anchor[0] - 160, anchor[1] - 420);
    app.sphere.draw(app.screen.context);
};
image.src = '/i/orion.png';

}