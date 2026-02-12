{

app.screen.addClickable(app.sphere);

let menu = document.querySelector('ul.menu');
let container = document.querySelector('.main');

let menuItem = document.querySelector('ul.menu li');
let menuCancelButton = document.querySelector('ul.menu li.close');

let setMenuPosition = point => {
    if (!point) point = [+menu.dataset.x, +menu.dataset.y];
    menu.style.left = Math.min(point[0] + 4, container.offsetWidth - menu.offsetWidth - 6) + 'px';
    menu.style.top = Math.min(point[1] + 4, container.offsetHeight - menu.offsetHeight - 6) + 'px';
    menu.dataset.x = point[0];
    menu.dataset.y = point[1];
};

function getStarName(item) {
    let s = item.querySelector('.title').textContent;
    return isNaN(Number(s)) ? s : `#${s}`;
}

app.sphere.point((point, neighbors) => {
    window.sendEvent?.(['click_map', 'stars_per_click', neighbors.length]);

    if (!neighbors.length) return;

    menu.innerHTML = '';
    menu.className = 'menu';

    neighbors.forEach(object => {
        let item = menuItem.cloneNode(true);

        item.querySelector('.title').innerHTML = astro.CelestialSphere.getStarName(object);
        item.querySelector('[data-id="ra"]').textContent = astro.CelestialSphere.toRA(object[0]);
        item.querySelector('[data-id="dec"]').textContent = astro.CelestialSphere.toDec(object[2]);
        item.querySelector('[data-id="m"]').textContent = object[3];
        item.querySelector('[data-id="spcl"]').textContent = object[6];

        menu.appendChild(item);

        window.sendEvent?.(['click_star', getStarName(item)]);
    });

    menu.appendChild(menuCancelButton.cloneNode(true));
    menu.classList.add('open');
    window.sendEvent?.('open_menu');

    setMenuPosition(point);
});

if (window.graphics && graphics.event) {
    let E = graphics.event;
    let clickPoint = null;

    E.onClickDown(window, event => {
        clickPoint = [event.pageX, event.pageY];

        if (!menu.contains(event.target) && menu.classList.contains('open')) {
            window.sendEvent?.(['close_menu', 'click_screen']);
            menu.classList.remove('open');
        }
    });

    E.onClickUp(window, event => {
        if (clickPoint) {
            let minDelta = 3;
            let delta = [
                Math.abs(event.pageX - clickPoint[0]),
                Math.abs(event.pageY - clickPoint[1]),
            ];

            if (delta[0] > minDelta || delta[1] > minDelta)
                window.sendEvent?.('drag_map');
        }

        clickPoint = null;
    });

    window.addEventListener('resize', () => menu.classList.remove('open'));

    E.onClickDown(window, event => {
        if (event.target.matches && event.target.matches('ul.menu li.close')) {
            window.sendEvent?.(['close_menu', 'click_close_button']);
            menu.classList.remove('open');
        }
        else {
            Array.from(document.querySelectorAll('ul.menu li')).forEach(item => {
                if (item.contains(event.target)) {
                    item.classList.add('selected');
                    menu.classList.add('expanded');
                    setMenuPosition();
                    window.sendEvent?.(['expand_menu_item', getStarName(item)]);
                }
                else item.classList.remove('selected');
            });
        }
    });
}

}