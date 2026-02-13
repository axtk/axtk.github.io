import type { Context } from "./Context.ts";
import { getMedia } from "./getMedia.ts";
import { hidePlaylist } from "./hidePlaylist.ts";

export function renderPlaylist(
  ctx: Context,
  selectedMarkers: HTMLElement[] | null,
) {
  let playlist = document.querySelector("#playlist");

  if (!playlist) return;

  if (!selectedMarkers || !selectedMarkers.length) {
    window.sendEvent?.("close_playlist.click_screen");
    hidePlaylist();
    return;
  }

  let list = document.createElement("div");

  list.className = "list";
  list.appendChild(getMedia(ctx, selectedMarkers));

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

  for (let audio of playlist.querySelectorAll("audio"))
    audio.addEventListener("play", () => {
      window.sendEvent?.(["play", String(audio.src.split("/").pop())]);
    });
}
