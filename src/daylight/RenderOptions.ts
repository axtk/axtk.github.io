import type {GeoLocation} from './astronomy/GeoLocation';
import type {getTracks} from './getTracks';

export type RenderOptions = {
    element: SVGElement;
    tracks: ReturnType<typeof getTracks>;
    location: GeoLocation;
    time: number | string | Date | undefined;
};
