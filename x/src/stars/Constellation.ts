export class Constellation {
    abbr: string;
    name: string;
    label: {
        ra: number;
        dec: number;
    };

    constructor({abbr, name, label}: Constellation) {
        this.abbr = abbr;
        this.name = name;
        this.label = label;
    }
};
