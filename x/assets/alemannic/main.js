{
  const dataRoot =
    "https://raw.githubusercontent.com/axtk/axtk.github.io/refs/heads/main/x/";

  let items = [];
  let refItems = [];

  let places = [];
  let hiddenPlaceLabels = ["Uster", "Vernier", "Schaan"];

  let placeNames = {
    Geneva: "Genève",
    Lucerne: "Luzern",
    Vienna: "Wien",
  };

  let refs = [
    // [56, 24.3, 'Stadt Zürich'],
    [36.5, 15.9, "Basel-Stadt"],
    // [54.7, 73, 'Bosco Gurin'],
    [76.2, 32.3, "Eschen, Liechtenstein"],
    // [66.2, 62.1, 'Chur, Graubünden']
  ];

  function loadMarkers() {
    return fetch(`${dataRoot}assets/alemannic/samples.json`)
      .then((res) => res.json())
      .then(({ alemannic }) => {
        items = alemannic;

        refItems = [
          items.find(({ title }) => title.includes(refs[0][2])).position,
          items.find(({ title }) => title.includes(refs[1][2])).position,
        ];

        return alemannic;
      });
  }

  function deselectMarkers() {
    let markers = Array.from(document.querySelectorAll("#map .marker"));

    for (let marker of markers) marker.classList.remove("selected");
  }

  function stopAudio() {
    let audios = Array.from(document.querySelectorAll("#playlist audio"));

    for (let audio of audios) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  function hidePlaylist() {
    stopAudio();
    deselectMarkers();
    playlist.classList.add("hidden");
  }

  function renderPlaylist(selectedMarkers) {
    let playlist = document.querySelector("#playlist");

    if (!selectedMarkers || !selectedMarkers.length) {
      window.sendEvent?.("close_playlist.click_screen");
      hidePlaylist();
      return;
    }

    let list = document.createElement("div");

    list.className = "list";
    list.appendChild(getMedia(selectedMarkers));

    if (!list.innerHTML) return;

    let closeButton = document.createElement("button");

    closeButton.className = "close";
    closeButton.textContent = "✕\xa0 Close";

    closeButton.addEventListener("click", () => {
      hidePlaylist();
      window.sendEvent?.("close_playlist.click_button");
    });

    playlist.innerHTML = "";
    playlist.appendChild(list);
    playlist.appendChild(closeButton);
    playlist.classList.remove("hidden");

    for (let marker of selectedMarkers) marker.classList.add("selected");

    let audios = Array.from(playlist.querySelectorAll("audio"));

    for (let audio of audios)
      audio.addEventListener("play", () => {
        window.sendEvent?.(["play", audio.src.split("/").pop()]);
      });
  }

  function initMap() {
    let map = document.querySelector("#map");
    let dx = 0,
      dy = 0;

    map.addEventListener("click", ({ clientX: x0, clientY: y0 }) => {
      stopAudio();
      deselectMarkers();

      let selectedMarkers = Array.from(map.querySelectorAll(".marker")).filter(
        (marker) => {
          let { left, right, top, bottom } = marker.getBoundingClientRect();

          return (
            x0 > left - dx &&
            x0 < right + dx &&
            y0 > top - dy &&
            y0 < bottom + dy
          );
        },
      );

      for (let marker of selectedMarkers)
        window.sendEvent?.(["click_marker", marker.title]);

      renderPlaylist(selectedMarkers);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("#map, button.close")) renderPlaylist(null);
    });
  }

  function escapeHTML(s) {
    return s
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;");
  }

  function getMedia(markers) {
    let fragment = document.createDocumentFragment();

    for (let marker of markers) {
      let k = Number(marker.dataset.index);
      let item = items[k];

      if (!item) continue;

      if (item.title) {
        let title = document.createElement("div");

        title.className = "item-title";
        title.textContent = item.title;

        fragment.appendChild(title);
      }

      for (let { title, author, url, source } of item.resources) {
        let element = document.createElement("figure");

        element.innerHTML =
          `<figcaption class="title">` +
          `<span class="title-content">${escapeHTML(title)}</span> ` +
          `<span class="author">${escapeHTML(author)}</span></figcaption>` +
          `<audio controls src="${url}"></audio>` +
          `<figcaption class="source">Source: ${escapeHTML(source)}</figcaption>`;

        fragment.appendChild(element);
      }
    }

    return fragment;
  }

  let qx, qy;

  function getCoords(lat, lon) {
    if (qx === undefined)
      qx = (refs[1][0] - refs[0][0]) / (refItems[1][1] - refItems[0][1]);

    if (qy === undefined)
      qy = (refs[1][1] - refs[0][1]) / (refItems[1][0] - refItems[0][0]);

    let x = refs[0][0] + qx * (lon - refItems[0][1]);
    let y = refs[0][1] + qy * (lat - refItems[0][0]);

    return { x, y };
  }

  function renderMarkers() {
    let map = document.querySelector("#map");
    let fragment = document.createDocumentFragment();

    for (let i = 0; i < items.length; i++) {
      let { position: pos, title } = items[i];
      let { x, y } = getCoords(pos[0], pos[1]);

      let marker = document.createElement("button");

      marker.className = "marker";
      marker.style.left = `${x}%`;
      marker.style.top = `${y}%`;
      marker.title = title;
      marker.dataset.index = i;

      fragment.appendChild(marker);
    }

    map.appendChild(fragment);
    initMap();
  }

  function loadPlaces() {
    let countryCodes = ["ch", "li", "at", "it", "fr", "de"];

    return Promise.all(
      countryCodes.map((countryCode) => {
        return fetch(
          `${dataRoot}assets/alemannic/places/${countryCode}.json`,
        ).then((res) => res.json());
      }),
    ).then(([ch, li, at, it, fr, de]) => {
      let allPlaces = [
        ...ch.slice(0, 18),
        ...li.slice(0, 2),
        ...at.slice(0, 12),
        ...it.slice(0, 55),
        ...fr.slice(0, 55),
        ...de.slice(0, 55),
      ];

      places = allPlaces
        .map((item) => ({
          ...item,
          ...getCoords(Number(item.lat), Number(item.lng)),
        }))
        .filter(({ city, x, y }) => {
          let offBounds = x < 0 || x > 100 || y < 0 || y > 100;

          return !offBounds && !hiddenPlaceLabels.includes(city);
        });
    });
  }

  function renderPlaces() {
    let map = document.querySelector("#map");
    let fragment = document.createDocumentFragment();

    for (let { city: name, x, y } of places) {
      // let {x, y} = getCoords(Number(lat), Number(lng));
      let label = document.createElement("div");

      label.className = "place";
      label.textContent = placeNames[name] || name;
      label.style.left = `${x}%`;
      label.style.top = `${y}%`;

      fragment.appendChild(label);
    }

    map.appendChild(fragment);
  }

  let countryLabels = [
    [46.76, 8.36, "ch", 5],
    [47.115, 9.565, "li", 0.5],
    [47.12, 10.08, "at"],
    [46.05, 9.75, "it"],
    [45.94, 8.28, "it"],
    [46.07, 6.57, "fr"],
    [47.6, 6.65, "fr"],
    [47.75, 8, "de"],
    [47.75, 9.9, "de"],
  ];

  function _renderCountryLabels() {
    let fragment = document.createDocumentFragment();

    for (let [lat, lon, code, fontSize = 2] of countryLabels) {
      let { x, y } = getCoords(lat, lon);
      let label = document.createElement("div");

      label.className = "country";
      label.dataset.code = code;
      label.textContent = code;
      label.style.fontSize = `${fontSize}rem`;
      label.style.left = `${x}%`;
      label.style.top = `${y}%`;

      fragment.appendChild(label);
    }

    document.querySelector("#map").appendChild(fragment);
  }

  Promise.all([loadMarkers(), loadPlaces()]).then(() => {
    // renderCountryLabels();
    renderPlaces();
    renderMarkers();
  });
}
