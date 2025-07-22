export default class Playlist {
  constructor(musicFiles, container) {
    this.musicFiles = musicFiles;
    this.container = container;
    this.currentIndex = -1;
    this.player = null;
    this.render();
    // this.bindEvents();
  }

  setPlayer(player) {
    this.player = player;
  }

  render() {
    this.container.innerHTML = '';
    this.musicFiles.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = idx === this.currentIndex ? 'active' : '';
      li.innerHTML = `<span class="music-title">${item.name}</span>`;
      li.addEventListener('click', () => {
        const item = this.musicFiles[idx];
        this.currentIndex = idx;
        this.updateActive();
        
        if (item.type === 'video') {
          // 创建视频元素
          const video = document.createElement('video');
          video.src = item.file;
          video.controls = true;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'contain';
          video.style.backgroundColor = 'black';
          
          // 处理全屏退出事件
          const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
              document.body.removeChild(video);
              video.removeEventListener('ended', handleFullscreenChange);
              video.removeEventListener('fullscreenchange', handleFullscreenChange);
              video.removeEventListener('webkitendfullscreen', handleFullscreenChange); // iOS
            }
          };
          
          video.addEventListener('ended', handleFullscreenChange);
          video.addEventListener('fullscreenchange', handleFullscreenChange);
          video.addEventListener('webkitendfullscreen', handleFullscreenChange); // iOS
          
          document.body.appendChild(video);
          
          // 移动端特殊处理
          const tryFullscreen = () => {
            // 标准全屏API
            if (video.requestFullscreen) {
              video.requestFullscreen().then(() => {
                video.play().catch(e => console.error('播放失败:', e));
              }).catch(err => {
                console.error('标准全屏失败:', err);
                tryIOSFullscreen();
              });
            } else {
              tryIOSFullscreen();
            }
          };
          
          // iOS特定全屏方法
          const tryIOSFullscreen = () => {
            if (video.webkitEnterFullscreen) {
              video.webkitEnterFullscreen();
              video.play().catch(e => console.error('iOS播放失败:', e));
            } else {
              console.error('该设备不支持全屏');
              document.body.removeChild(video);
            }
          };
          
          tryFullscreen();
        } else {
          if (this.player) this.player.play(idx);
        }
      });
      this.container.appendChild(li);
    });
  }

  updateActive() {
    Array.from(this.container.children).forEach((li, idx) => {
      li.className = idx === this.currentIndex ? 'active' : '';
    });
  }

  setCurrentIndex(idx) {
    this.currentIndex = idx;
    this.updateActive();
  }
}
