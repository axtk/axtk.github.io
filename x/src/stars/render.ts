import {renderColors} from './renderColors';
import {renderGrid} from './renderGrid';
import {renderStars} from './renderStars';
import {renderStarLabels} from './renderStarLabels';
import {renderStarPatterns} from './renderStarPatterns';
import {renderConstellationLabels} from './renderConstellationLabels';
import {renderConstellationLines} from './renderConstellationLines';
import type {Context} from './Context';

export function render(ctx: Context) {
    renderColors(ctx);
    renderGrid(ctx);
    renderStars(ctx);
    renderStarLabels(ctx);
    renderStarPatterns(ctx);
    renderConstellationLabels(ctx);
    renderConstellationLines(ctx);
}
