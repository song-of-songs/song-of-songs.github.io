export default class Playlist {
  constructor(musicFiles, container) {
    this.musicFiles = musicFiles;
    this.container = container;
    this.currentIndex = -1;
    this.loadingIndex = -1;
    this.player = null;
    this.isVisible = false;
    this.render();
    this.renderOverlay();
  }

  setPlayer(player) {
    this.player = player;
  }

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
        if (this.player) {
          this.player.play(index);
          this.hide();
        }
      });

      this.container.appendChild(listItem);
    });
  }

  renderOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'playlist-overlay';
    this.overlay.style.display = 'none';
    this.overlay.innerHTML = `
      <div class="playlist-container">
        <div class="playlist-header">
          <h3>播放列表</h3>
          <button class="close-btn">
            <img src="ico/exit.svg" alt="关闭">
          </button>
        </div>
        <ul class="music-list"></ul>
      </div>
    `;
    document.body.appendChild(this.overlay);

    // 渲染歌曲列表
    const musicList = this.overlay.querySelector('.music-list');
    this.musicFiles.forEach((file, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'playlist-item';
      listItem.innerHTML = `
        <div class="song-title">${file.name || file.title || '未知歌曲'}</div>
      `;

      listItem.addEventListener('click', () => {
        if (this.player) {
          this.player.play(index);
          this.hide();
        }
      });

      musicList.appendChild(listItem);
    });

    this.overlay.querySelector('.close-btn').addEventListener('click', () => {
      this.hide();
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });
  }

  show() {
    this.isVisible = true;
    this.overlay.style.display = 'block';
    setTimeout(() => {
      this.overlay.classList.add('visible');
    }, 10);
  }

  hide() {
    this.isVisible = false;
    this.overlay.classList.remove('visible');
    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 300);
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
