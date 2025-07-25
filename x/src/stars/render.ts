import {renderStarColors} from './renderStarColors';
import {renderGrid} from './renderGrid';
import {renderStars} from './renderStars';
import {renderStarLabels} from './renderStarLabels';
import {renderStarPatterns} from './renderStarPatterns';
import {renderConstellationLabels} from './renderConstellationLabels';
import {renderHintLines} from './renderHintLines';
import type {Context} from './Context';

export function render(ctx: Context) {
    renderGrid(ctx);
    renderStarColors(ctx);
    renderStars(ctx);
    renderStarLabels(ctx);
    renderStarPatterns(ctx);
    renderConstellationLabels(ctx);
    renderHintLines(ctx);
}
