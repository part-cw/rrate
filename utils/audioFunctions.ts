import { AudioPlayer } from 'expo-audio';

// Loads either the breathing audio or end chime
export default function loadAndPlayAudio(player: AudioPlayer) {
  player.seekTo(0);
  player.play();
};