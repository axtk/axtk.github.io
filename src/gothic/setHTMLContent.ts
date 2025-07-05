import {escapeRegExp} from 'stfm';
import type {SearchResult} from './SearchResult';
import type {MatchedItem} from './MatchedItem';
import type {Context} from './Context';
import {getAbbrHTML} from './getAbbrHTML';

export function setHTMLContent(item: MatchedItem, output: SearchResult, ctx: Context) {
    let htmlTerm = item.term;
    let htmlDef = item.def;

    // html entities
    htmlTerm = htmlTerm.replace(/\{\{(&\w+)\}\}/g, '$1;');
    htmlDef = htmlDef.replace(/\{\{(&\w+)\}\}/g, '$1;');

    // abbrs
    if (ctx.data.abbrs) {
        let abbrKeys = Object.keys(ctx.data.abbrs);

        for (let key of abbrKeys) {
            let abbrKeyPattern = new RegExp(escapeRegExp(`{{${key}}}`), 'g');
            let abbrContent = getAbbrHTML(key, ctx);

            htmlTerm = htmlTerm.replace(abbrKeyPattern, abbrContent);
            htmlDef = htmlDef.replace(abbrKeyPattern, abbrContent);
        }
    }

    // custom tags
    htmlDef = htmlDef.replace(
        /(<deriv>)/g,
        '$1<strong class="title">Derivations:</strong> ',
    );
    htmlDef = htmlDef.replace(
        /(<comp>)/g,
        '$1<strong class="title">Compounds:</strong> ',
    );
    htmlDef = htmlDef.replace(
        /<(note|def|ex(-t|-sep)?|term|d|intro|deriv|comp)>/g,
        '<span class="$1">',
    );
    htmlDef = htmlDef.replace(
        /<\/(note|def|ex(-t|-sep)?|term|d|intro|deriv|comp)>/g,
        '</span>',
    );
    htmlDef = htmlDef.replace(
        /<(ex-s|spec|v)>/g,
        '<i class="$1">',
    );
    htmlDef = htmlDef.replace(
        /<\/(ex-s|spec|v)>/g,
        '</i>',
    );

    // search term highlighting
    let {value: expression, captureIndex} = output.expressions[item.expressionIndex];
    let queryExpression: RegExp, highlightPattern: string;

    if (captureIndex > 1) {
        queryExpression = new RegExp(expression, 'gi');
        highlightPattern = `$${captureIndex - 1}<mark>$${captureIndex}</mark>$${captureIndex + 1}`;
    }
    else {
        queryExpression = new RegExp(`(${expression})`, 'gi');
        highlightPattern = '<mark>$1</mark>';
    }

    htmlTerm = htmlTerm.replace(queryExpression, highlightPattern);
    htmlDef = htmlDef.replace(queryExpression, highlightPattern);

    // fixing split up html entities
    htmlTerm = htmlTerm.replace(/&<\/mark>(#?\w+;)/g, '&$1</mark>');
    htmlDef = htmlDef.replace(/&<\/mark>(#?\w+;)/g, '&$1</mark>');

    item.htmlTerm = htmlTerm;
    item.htmlDef = htmlDef;

    return item;
}
