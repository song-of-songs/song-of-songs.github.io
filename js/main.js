import Playlist from './components/Playlist.js';
import Player from './components/Player.js';

// 在文件顶部添加如下代码，自动清除缓存
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) caches.delete(name);
  });
}
localStorage.clear();
sessionStorage.clear();

let musicFiles = [];

fetch('musicFiles.json')
  .then(res => res.json())
  .then(data => {
    musicFiles = data;
    const playlist = new Playlist(musicFiles, document.getElementById('musicList'));
    const player = new Player(musicFiles, document.getElementById('playerBar'), playlist);
    playlist.setPlayer(player);
  });