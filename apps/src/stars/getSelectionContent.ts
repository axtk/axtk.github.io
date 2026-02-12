import type { Star } from "./Star.ts";

function createCell(className: string, content: string | undefined) {
  let cell = document.createElement("td");

  cell.className = `${content ? "" : "x "}${className}`;
  cell.textContent = content || "•";

  return cell;
}

export function getSelectionContent(stars: Star[]) {
  let content = document.createDocumentFragment();
  let list = document.createElement("table");
  let hasProperNames = stars.some(({ properName }) => Boolean(properName));

  for (let star of stars) {
    let item = document.createElement("tr");

    if (hasProperNames) item.append(createCell("n", star.properName));

    item.append(createCell("b", star.bayerName || `HD ${star.id}`));
    item.append(createCell("m", `${star.magnitude}ᵐ`));

    list.append(item);
  }

  content.append(list);

  // let closeButton = document.createElement('button');

  // closeButton.textContent = '×';
  // closeButton.setAttribute('aria-label', 'Close');
  // closeButton.addEventListener('click', () => {
  //     document.querySelector('#screenmenu')?.classList.add('hidden');
  // });
  // content.append(closeButton);

  return content;
}
