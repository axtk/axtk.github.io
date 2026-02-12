for (let caption of document.querySelectorAll("figcaption")) {
  let link = caption.querySelector("a");
  let container = caption.closest("figure");

  if (container?.querySelector("picture") && link) {
    let href = link.getAttribute("href");

    for (let picture of container.querySelectorAll("picture")) {
      if (!picture.firstElementChild || picture.querySelector("a") !== null)
        continue;

      let attrs = [`href="${href}"`];

      if (!window.location.hostname.includes(".github.io"))
        attrs.push('target="_blank"');

      picture.innerHTML = `<a ${attrs.join(" ")}>${picture.innerHTML}</a>`;
    }
  }
}
