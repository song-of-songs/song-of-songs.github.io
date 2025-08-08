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
    this.musicFiles.forEach((file, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'playlist-item';
      listItem.innerHTML = `
        <div class="song-title">${file.name || file.title || '未知歌曲'}</div>
      `;

      listItem.addEventListener('click', () => {
        // 跳转到播放器页面并传递歌曲索引
        window.location.href = `player.html?song=${index}`;
      });

      this.container.appendChild(listItem);
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
