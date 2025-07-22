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
            }
          };
          
          video.addEventListener('ended', handleFullscreenChange);
          video.addEventListener('fullscreenchange', handleFullscreenChange);
          
          document.body.appendChild(video);
          
          // 请求全屏并播放
          video.requestFullscreen().then(() => {
            video.play();
          }).catch(err => {
            console.error('全屏请求失败:', err);
            document.body.removeChild(video);
          });
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
