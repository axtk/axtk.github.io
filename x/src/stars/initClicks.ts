import type {Context} from './Context';
import {fromScreenPosition} from './fromScreenPosition';
import {getScreenPosition} from './getScreenPosition';
import {getSelectionContent} from './getSelectionContent';
import {setMenu} from './setMenu';
import type {Star} from './Star';

const {abs} = Math;
const clickRadius = 5;

function byMagnitude(star1: Star, star2: Star) {
    return star1.magnitude - star2.magnitude;
}

export function initClicks(ctx: Context) {
    document.addEventListener('click', event => {
        if (!ctx.element.contains(event.target as Element))
            return;

        let {left, top} = ctx.element.getBoundingClientRect();
        let x = event.offsetX - left;
        let y = event.offsetY - top;

        let pos = fromScreenPosition(x, y, ctx);
        console.log('click', pos);

        if (pos === null)
            return;

        let matches: Star[] = [];

        for (let star of ctx.stars) {
            let starPos = getScreenPosition(star.ra, star.dec, ctx);

            if (starPos === null)
                continue;

            if (abs(starPos[0] - x) <= clickRadius && abs(starPos[1] - y) <= clickRadius)
                matches.push(star);
        }

        matches.sort(byMagnitude);

        for (let star of matches) {
            console.log(`#${star.id}; ${star.name}`, star.magnitude);
            window.sendEvent?.(['click star', star.name ?? `#${star.id}`]);
        }

        setMenu(x, y, getSelectionContent(matches), ctx);
    });
}
