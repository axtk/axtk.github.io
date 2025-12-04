import { escapeRegExp } from "../_utils/escapeRegExp";
import type { Context } from "./Context";
import type { Dictionary } from "./Dictionary";
import type { DictionaryKey } from "./DictionaryKey";
import { fetchData } from "./fetchData";
import type { MatchedItem } from "./MatchedItem";
import type { SearchResult } from "./SearchResult";
import { setHTMLContent } from "./setHTMLContent";
import { translit } from "./translit";

// @date 2020-04-17
function normalize(s: string | null | undefined) {
  if (!s) return "";

  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/þ/gi, "th")
    .replace(/á/gi, "a")
    .replace(/é/gi, "e")
    .replace(/í/gi, "i")
    .replace(/ó/gi, "o")
    .replace(/ú/gi, "u");
}

function byRelevance({ relevance: ra = 0 }, { relevance: rb = 0 }) {
  return ra === rb ? 0 : ra > rb ? -1 : 1;
}

export async function search(ctx: Context): Promise<SearchResult | undefined> {
  let q = normalize(translit(ctx.q));

  if (!q) return;

  await fetchData(ctx);

  let output: SearchResult = {
    expressions: [
      {
        value: `\\b${escapeRegExp(q)}\\b`,
        captureIndex: 1,
      },
      {
        value: escapeRegExp(q),
        captureIndex: 1,
      },
    ],
    entries: [],
  };

  if (q.length < 4)
    output.expressions = [
      {
        value: `(^|\\pP|\\b)(${escapeRegExp(q)})(\\pP|\\b|$)`,
        captureIndex: 2,
      },
    ];

  let { expressions } = output;
  let en = expressions.length;

  let dictionaries: Record<DictionaryKey, Dictionary | null | undefined> = {
    eg: ctx.data.eg,
    ge: ctx.data.ge,
  };

  for (let [key, dict] of Object.entries(dictionaries)) {
    if (!dict) continue;

    for (let item of dict) {
      let normalizedTerm = normalize(item.t);
      let normalizedDef = normalize(item.d);

      let matched = false;

      for (let ei = 0; ei < en && !matched; ei++) {
        let { value: expression } = expressions[ei];

        let matchesTerm = new RegExp(expression, "g").test(normalizedTerm);
        let entryRegExp = new RegExp(expression, "g");

        matched = matchesTerm || entryRegExp.test(normalizedDef);

        if (!matched) continue;

        let matchedItem: MatchedItem = {
          dictionaryKey: key as DictionaryKey,
          expressionIndex: ei,
          term: item.t,
          def: item.dx,
        };

        let r0 = 20 * (en - ei - 1);

        if (matchesTerm) {
          if (normalizedTerm === q) matchedItem.relevance = r0 + 20;
          else {
            let ql = q.length,
              tl = normalizedTerm.length;
            matchedItem.relevance =
              r0 + 10 + 10 * (ql < tl ? ql / tl : tl / ql);
          }
        } else if (normalizedDef.length !== 0)
          matchedItem.relevance =
            r0 + 10 * (1 - entryRegExp.lastIndex / normalizedDef.length);

        output.entries.push(setHTMLContent(matchedItem, output, ctx));
      }
    }
  }

  output.entries.sort(byRelevance);

  return output;
}
