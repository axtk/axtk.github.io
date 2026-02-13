import { deselectMarkers } from "./deselectMarkers.ts";
import { stopAudio } from "./stopAudio.ts";

export function hidePlaylist() {
  stopAudio();
  deselectMarkers();
  document.querySelector("#playlist")?.classList.add("hidden");
}
