import type {Context} from './Context';
import type {Star} from './Star';

export function getStarRadius(star: Star, ctx: Context) {
    if (ctx.mode === 'fantasy')
        return 2*(6.75 - star.magnitude);

    if (ctx.mode === 'light')
        return .6*(6.75 - star.magnitude);

    return .7*(6.75 - star.magnitude);
}
