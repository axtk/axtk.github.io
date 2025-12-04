import { escapeHTML } from "../_utils/escapeHTML.ts";
import { escapeRegExp } from "../_utils/escapeRegExp.ts";
import type { Context } from "./Context.ts";
import { pickRandom } from "./pickRandom.ts";

const maxExamples = 3;

function withMark(s: string | undefined, mark: string | undefined) {
  if (s === undefined || mark === undefined) return s ?? "";

  return s.replace(
    new RegExp(escapeRegExp(mark), "g"),
    (s) => `<span class="mark">${escapeHTML(s)}</span>`,
  );
}

const langNames: Record<string, string> = {
  ru: "по-русски",
  cz: "по-чешски",
  sk: "по-словацки",
  sl: "по-словенски",
  pl: "по-польски",
  sr: "по-сербски",
};

function getCharKeys(s: string, ctx: Context) {
  let charKeys = new Set(Object.keys(ctx.chars));
  let keySet = new Set<string>();

  for (let c of s.toLowerCase()) {
    if (charKeys.has(c)) keySet.add(c);
  }

  return Array.from(keySet);
}

type ExampleCellProps = {
  entries: string[];
  mark?: string;
};

function getExampleCell({ entries, mark }: ExampleCellProps) {
  let firstEntry = entries[0];
  let otherEntries = entries.slice(1);

  let firstEntryContent: Element | null = null;
  let otherEntriesContent: Element | null = null;

  let td = document.createElement("td");

  if (firstEntry) {
    let [lang, primary, secondary] = firstEntry.split("|");

    firstEntryContent = document.createElement("div");
    firstEntryContent.className = "entry-content";

    if (secondary)
      firstEntryContent.innerHTML += `<span class="secondary">${escapeHTML(secondary)}</span>&nbsp;→ `;

    firstEntryContent.innerHTML +=
      `<strong>${withMark(primary, mark)}</strong> ` +
      `<span class="lang">${escapeHTML(langNames[lang] ?? lang)}</span>`;

    td.appendChild(firstEntryContent);
  }

  if (otherEntries?.length) {
    otherEntriesContent = document.createElement("div");
    otherEntriesContent.className = "entry-content";

    for (let i = 0; i < otherEntries.length; i++) {
      let [lang, primary, secondary] = otherEntries[i].split("|");

      otherEntriesContent.innerHTML +=
        (i === 0 ? "" : '<span class="sep">, </span>') +
        "<span>" +
        `<strong class="primary">${withMark(primary, mark)}</strong> ` +
        (secondary
          ? `<span class="secondary">(${escapeHTML(secondary)})</span> `
          : "") +
        `<span class="lang">${escapeHTML(langNames[lang] ?? lang)}</span>` +
        "</span>";
    }

    td.appendChild(otherEntriesContent);
  }

  return td;
}

export function renderCharHint(output: string, ctx: Context) {
  let container = document.querySelector(".chars")!;
  let keys = getCharKeys(output, ctx);

  container.toggleAttribute("hidden", keys.length === 0);

  if (keys.length === 0) return;

  let table = container.querySelector("table")!;
  table.innerHTML = "";

  for (let charKey of keys) {
    let { examples, character } = ctx.chars[charKey];

    examples = pickRandom(
      examples.filter((entries) => entries.at(-1) !== "-"),
      maxExamples,
    );

    let tbody = document.createElement("tbody");

    for (let i = 0; i < examples.length; i++) {
      let entries = examples[i];
      let tr = document.createElement("tr");

      if (i === 0) {
        let th = document.createElement("th");

        th.rowSpan = examples.length;
        th.textContent = character;

        tr.appendChild(th);
      }

      let exampleCell = getExampleCell({ entries, mark: character });

      if (exampleCell.innerHTML) {
        tr.appendChild(exampleCell);
        tbody.appendChild(tr);
      }
    }

    table.appendChild(tbody);
  }
}
