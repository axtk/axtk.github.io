import type {getFormInput} from './getFormInput';

type FormInput = ReturnType<typeof getFormInput>;

export function isValidFormInput({location, time}: FormInput) {
    if (!location || isNaN(location.lat) || isNaN(location.lon))
        return false;

    if (time === undefined || time === '' || typeof time === 'number')
        return true;

    return !isNaN(new Date(time).getTime());
}
