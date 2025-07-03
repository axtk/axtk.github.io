import type {Star} from './Star';
import type {ConstellationLabel} from './ConstellationLabel';

export type Context = {
    element: SVGElement;
    stars: Star[];
    constellationLabels: ConstellationLabel[];
    constellationNames: Record<string, string>;
    constellationLines: [number, number][][];
    tilt: [number, number];
    mode: 'dark' | 'light' | 'fantasy';
};
