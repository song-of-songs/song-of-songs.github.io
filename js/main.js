import Playlist from './components/Playlist.js';
import Player from './components/Player.js';

let musicFiles = [];

fetch('musicFiles.json')
  .then(res => res.json())
  .then(data => {
    musicFiles = data;
    const playlist = new Playlist(musicFiles, document.getElementById('musicList'));
    const player = new Player(musicFiles, document.getElementById('playerBar'), playlist);
    playlist.setPlayer(player);
  });