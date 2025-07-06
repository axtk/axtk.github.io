import {renderGrid} from './renderGrid';
import {renderStars} from './renderStars';
import {renderStarLabels} from './renderStarLabels';
import {renderConstellationLabels} from './renderConstellationLabels';
import {renderConstellationLines} from './renderConstellationLines';
import type {Context} from './Context';

export function render(ctx: Context) {
    renderGrid(ctx);
    renderStars(ctx);
    renderStarLabels(ctx);
    renderConstellationLabels(ctx);
    renderConstellationLines(ctx);
}
