import type {Context} from './Context';
import {getDimensions} from './getDimensions';
import type {Star} from './Star';

const maxWidth = 240;

export function setMenu(x: number, y: number, stars: Star[], ctx: Context) {
    let {width, height} = getDimensions(ctx);
    let menu = document.querySelector<HTMLDivElement>('#screenmenu');

    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'screenmenu';
        ctx.element.parentElement?.appendChild(menu);
    }

    if (stars.length === 0) {
        menu.classList.add('hidden');
        return;
    }

    let list = document.createElement('ul');

    for (let star of stars) {
        let listItem = document.createElement('li');

        listItem.textContent = star.name ?? `#${star.id}`;
        list.appendChild(listItem);
    }

    // let closeButton = document.createElement('button');

    // closeButton.textContent = '×';
    // closeButton.setAttribute('aria-label', 'Close');
    // closeButton.addEventListener('click', () => {
    //     document.querySelector('#screenmenu')?.classList.add('hidden');
    // });

    menu.innerHTML = '';
    menu.style.width = '';

    menu.appendChild(list);
    // menu.appendChild(closeButton);
    menu.classList.remove('hidden');

    let {width: w, height: h} = menu.getBoundingClientRect();

    if (w > maxWidth) {
        menu.style.width = `${maxWidth}px`;
        menu.classList.add('wide');
        w = maxWidth;
    }
    else menu.classList.remove('wide');

    let menuX = Math.min(x + 4, width - w - 6);
    let menuY = Math.min(y + 4, height - h - 6);

    menu.setAttribute('style', `--x: ${menuX}px; --y: ${menuY}px;`);
}
