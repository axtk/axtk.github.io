export function deselectMarkers() {
  for (let marker of document.querySelectorAll("#map .marker"))
    marker.classList.remove("selected");
}
