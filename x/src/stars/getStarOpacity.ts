import type {Context} from './Context';
import type {Star} from './Star';

export function getStarOpacity(star: Star, ctx: Context) {
    if (ctx.mode === 'fantasy')
        return Math.min(.5 + .2*(6.75 - star.magnitude), 1);

    return Math.min(.25 + .12*(6.75 - star.magnitude), 1);
}
