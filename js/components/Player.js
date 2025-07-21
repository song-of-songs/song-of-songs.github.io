import formatTime from '../utils/formatTime.js';

export default class Player {
  constructor(musicFiles, container, playlist) {
    this.musicFiles = musicFiles;
    this.container = container;
    this.playlist = playlist;
    this.audio = new Audio();
    this.currentIndex = -1;
    this.isLoop = false;
    this.isPlaying = false;
    this.speed = 1;
    this.render();
    this.bindEvents();
    this.updateUI();
  }

  render() {
    this.container.innerHTML = `
      <div class="player-bar">
        <div class="player-progress-area">
          <button id="backwardBtn" class="circle-btn"><img src="ico/rewind10.svg" alt="后退10秒"></button>
          <div class="player-progress-wrap">
            <div class="player-progress-bg">
              <div class="player-progress" id="playerProgressBar"></div>
            </div>
          </div>
          <button id="forwardBtn" class="circle-btn"><img src="ico/forward5.svg" alt="快进5秒"></button>
          <span id="playerTime" class="player-time">0:00 / 0:00</span>
        </div>
        <div class="player-controls-area">
          <button id="prevBtn"><img src="ico/prev.svg" alt="上一首"></button>
          <button id="playPauseBtn"><img id="playPauseIcon" src="ico/play.svg" alt="播放"></button>
          <button id="nextBtn"><img src="ico/next.svg" alt="下一首"></button>
          <button id="loopBtn" class="loop-btn">循环</button>
          <select id="playerSpeed" class="speed-select">
            <option value="0.5">0.5x</option>
            <option value="1" selected>1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
        <div class="player-title" id="playerTitle">未在播放</div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#playPauseBtn').onclick = () => this.togglePlayPause();
    this.container.querySelector('#prevBtn').onclick = () => this.playPrev();
    this.container.querySelector('#nextBtn').onclick = () => this.playNext();
    this.container.querySelector('#backwardBtn').onclick = () => this.backward10s();
    this.container.querySelector('#forwardBtn').onclick = () => this.forward5s();
    this.container.querySelector('#loopBtn').onclick = () => this.toggleLoop();
    this.container.querySelector('#playerSpeed').onchange = (e) => this.setSpeed(e.target.value);

    // 进度条点击跳转
    this.container.querySelector('.player-progress-bg').onclick = (e) => {
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      if (this.audio.duration) this.audio.currentTime = percent * this.audio.duration;
    };

    // 音频事件
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onEnded());
  }

  play(idx) {
    if (idx < 0 || idx >= this.musicFiles.length) return;
    this.currentIndex = idx;
    this.audio.src = this.musicFiles[idx].file;
    this.audio.playbackRate = this.speed;
    this.audio.loop = this.isLoop;
    this.audio.play();
    this.isPlaying = true;
    this.updateUI();
    this.playlist.setCurrentIndex(idx);
  }

  togglePlayPause() {
    if (this.currentIndex === -1) {
      this.play(0);
      return;
    }
    if (this.audio.paused) {
      this.audio.play();
      this.isPlaying = true;
    } else {
      this.audio.pause();
      this.isPlaying = false;
    }
    this.updateUI();
  }

  playPrev() {
    let idx = this.currentIndex > 0 ? this.currentIndex - 1 : this.musicFiles.length - 1;
    this.play(idx);
  }

  playNext() {
    let idx = this.currentIndex < this.musicFiles.length - 1 ? this.currentIndex + 1 : 0;
    this.play(idx);
  }

  backward10s() {
    this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
  }

  forward5s() {
    this.audio.currentTime = Math.min(this.audio.currentTime + 5, this.audio.duration || 0);
  }

  toggleLoop() {
    this.isLoop = !this.isLoop;
    this.audio.loop = this.isLoop;
    this.updateUI();
  }

  setSpeed(val) {
    this.speed = parseFloat(val);
    this.audio.playbackRate = this.speed;
  }

  updateProgress() {
    const progressBar = this.container.querySelector('#playerProgressBar');
    const playerTime = this.container.querySelector('#playerTime');
    if (this.audio.duration) {
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      progressBar.style.width = percent + '%';
      playerTime.textContent = `${formatTime(this.audio.currentTime)} / ${formatTime(this.audio.duration)}`;
    } else {
      progressBar.style.width = '0%';
      playerTime.textContent = '0:00 / 0:00';
    }
  }

  updateUI() {
    // 歌名
    const title = this.container.querySelector('#playerTitle');
    title.textContent = this.currentIndex === -1 ? '未在播放' : this.musicFiles[this.currentIndex].name;
    // 播放/暂停图标
    const playPauseIcon = this.container.querySelector('#playPauseIcon');
    playPauseIcon.src = this.isPlaying ? 'ico/Pause.svg' : 'ico/play.svg';
    playPauseIcon.alt = this.isPlaying ? '暂停' : '播放';
    // 循环按钮高亮
    const loopBtn = this.container.querySelector('#loopBtn');
    if (this.isLoop) {
      loopBtn.style.background = '#444';
      loopBtn.style.color = '#ffd700';
    } else {
      loopBtn.style.background = 'none';
      loopBtn.style.color = '#e0e0e0';
    }
    // 播放速度
    this.container.querySelector('#playerSpeed').value = this.speed;
    // 进度条
    this.updateProgress();
  }

  onEnded() {
    if (this.isLoop) {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.playNext();
    }
  }
}