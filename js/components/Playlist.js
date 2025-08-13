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
          // 更新URL参数
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('song', index);
          window.history.pushState({}, '', newUrl);
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
          // 更新URL参数
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('song', index);
          window.history.pushState({}, '', newUrl);
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
      // 清除之前的高亮
      const previousActive = this.overlay.querySelector('.music-list li.active');
      if (previousActive) {
        previousActive.classList.remove('active');
      }
      // 高亮当前播放歌曲
      if (this.player && this.player.currentIndex >= 0) {
        const activeItem = this.overlay.querySelector('.music-list').children[this.player.currentIndex];
        if (activeItem) {
          activeItem.classList.add('active');
          activeItem.scrollIntoView({block: 'center', behavior: 'smooth'});
        }
      }
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
    // 更新播放列表中的高亮状态
    if (this.isVisible && this.overlay) {
      const previousActive = this.overlay.querySelector('.music-list li.active');
      if (previousActive) {
        previousActive.classList.remove('active');
      }
      if (idx >= 0) {
        const activeItem = this.overlay.querySelector(`.music-list li:nth-child(${idx + 1})`);
        if (activeItem) {
          activeItem.classList.add('active');
          activeItem.scrollIntoView({block: 'center', behavior: 'smooth'});
        }
      }
    }
  }
}
