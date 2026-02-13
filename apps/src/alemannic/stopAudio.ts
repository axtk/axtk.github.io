export function stopAudio() {
  for (let audio of document.querySelectorAll<HTMLAudioElement>(
    "#playlist audio",
  )) {
    audio.pause();
    audio.currentTime = 0;
  }
}
