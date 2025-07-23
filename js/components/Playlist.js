export default class Playlist {
  constructor(musicFiles, container) {
    this.musicFiles = musicFiles;
    this.container = container;
    this.currentIndex = -1;
    this.loadingIndex = -1; // 新增加载状态索引
    this.player = null;
    this.render();
  }

  setPlayer(player) {
    this.player = player;
  }

  // 设置加载状态
  setLoadingIndex(idx) {
    this.loadingIndex = idx;
    this.updateActive();
  }

  render() {
    this.container.innerHTML = '';
    this.musicFiles.forEach((item, idx) => {
      const li = document.createElement('li');
      
      // 根据状态设置类名
      let className = '';
      if (idx === this.currentIndex) className += 'active ';
      if (idx === this.loadingIndex) className += 'loading';
      
      li.className = className.trim();
      li.innerHTML = `<span class="music-title">${item.name}</span>`;
      li.addEventListener('click', () => {
        // 如果点击的是当前正在播放的歌曲，则忽略
        if (idx === this.currentIndex) {
          return;
        }
        this.currentIndex = idx;
        this.updateActive();
        if (this.player) this.player.play(idx);
      });
      this.container.appendChild(li);
    });
  }

  updateActive() {
    Array.from(this.container.children).forEach((li, idx) => {
      let className = '';
      if (idx === this.currentIndex) className += 'active ';
      if (idx === this.loadingIndex) className += 'loading';
      li.className = className.trim();
    });
  }

  setCurrentIndex(idx) {
    this.currentIndex = idx;
    this.updateActive();
  }
}
