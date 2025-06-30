import {equ2hor} from '../equ2hor';
import type {GeoLocation} from '../GeoLocation';
import {getEquatorialCoordinates} from './getEquatorialCoordinates';

export function getHorizontalCoordinates(
    date: Date | number | string,
    location: GeoLocation,
) {
    return equ2hor(getEquatorialCoordinates(date), date, location);
}
