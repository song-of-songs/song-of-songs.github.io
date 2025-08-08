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
    
    // 根据当前页面路径判断页面类型
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
      // 播放列表页：只初始化播放列表
      const playlist = new Playlist(musicFiles, document.getElementById('musicList'));
    } 
    else if (path.includes('player.html')) {
      // 播放器页：初始化播放器
      const playerBar = document.getElementById('playerBar');
      const player = new Player(musicFiles, playerBar, null);
      
      // 解析URL参数获取曲目索引
      const urlParams = new URLSearchParams(window.location.search);
      const trackIndex = parseInt(urlParams.get('index') || 0);
      
      // 播放指定曲目
      if (trackIndex >= 0 && trackIndex < musicFiles.length) {
        player.play(trackIndex);
      }
    }
  });
