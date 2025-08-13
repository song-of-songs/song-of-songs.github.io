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
      
      // 添加对playSong事件的监听
      window.addEventListener('playSong', (e) => {
        const songIndex = e.detail;
        if (songIndex >= 0 && songIndex < musicFiles.length) {
          player.play(songIndex);
        }
      });
      
      // 解析URL参数获取曲目索引
      const urlParams = new URLSearchParams(window.location.search);
      const songIndex = parseInt(urlParams.get('song') || 0);

      // 初始化：隐藏播放前提示
      const playPre = document.getElementById('playPre');
      playPre.style.display = 'none'; // 隐藏播放前提示

      // 初始化：显示透明覆盖层 playPre
      const playOverlay = document.getElementById('playOverlay');
      playOverlay.style.display = 'block'; // 显示透明覆盖层
      playOverlay.style.position = "fixed ";
      playOverlay.style.top = " 0 ";
      playOverlay.style.left = " 0 ";
      playOverlay.style.width = " 100% ";
      playOverlay.style.height = " 100% ";
      playOverlay.style.background = " rgba(0,0,0,0.01) ";
      playOverlay.style.zIndex = " 1000 ";
      playOverlay.style.cursor = " pointer ";
      playOverlay.style.display = " flex ";
      playOverlay.style.justifyContent = "center";
      playOverlay.style.alignItems = "center"; 
      playOverlay.style.color = "white";
      playOverlay.style.fontSize = "24px";

      // 初始化：显示加载状态指示器
      const loadingBar = document.getElementById('playerLoading');
      loadingBar.style.display = 'block'; // 显示加载状态指示器
      
      // 如果URL中有歌曲索引，立即触发播放
      // if (!isNaN(songIndex)) {
      //   window.dispatchEvent(new CustomEvent('playSong', { detail: songIndex }));
      // }
    }
  });
