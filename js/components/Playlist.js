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
      li.className = idx === this.currentIndex ? 'active' : '';
    });
  }

  setCurrentIndex(idx) {
    this.currentIndex = idx;
    this.updateActive();
  }
}
