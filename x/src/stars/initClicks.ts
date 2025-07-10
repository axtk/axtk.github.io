import type {Context} from './Context';
import {fromScreenPosition} from './fromScreenPosition';
import {getScreenPosition} from './getScreenPosition';
import type {Star} from './Star';

const {abs} = Math;
const clickRadius = 5;

function byMagnitude(star1: Star, star2: Star) {
    return star1[2] - star2[2];
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
            let starPos = getScreenPosition(star[0], star[1], ctx);

            if (starPos === null)
                continue;

            if (abs(starPos[0] - x) <= clickRadius && abs(starPos[1] - y) <= clickRadius)
                matches.push(star);
        }

        matches.sort(byMagnitude);

        for (let star of matches) {
            console.log(`#${star[3]}; ${star[5]}`, star[2]);
            window.sendEvent?.(['click star', String(star[5] ?? `#${star[3]}`)]);
        }
    });
}
