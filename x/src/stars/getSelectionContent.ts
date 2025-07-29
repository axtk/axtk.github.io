import type {Star} from './Star';

export function getSelectionContent(stars: Star[]) {
    let content = document.createDocumentFragment();
    let list = document.createElement('ul');

    for (let star of stars) {
        let listItem = document.createElement('li');

        listItem.textContent = star.name ?? `#${star.id}`;
        list.appendChild(listItem);
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
