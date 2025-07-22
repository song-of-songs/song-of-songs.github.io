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
        <!-- 视频播放区域 -->
        <div id="playerVideoArea" style="display: none; text-align: center; margin-bottom: 10px;">
          <video id="playerVideo" style="width: 100%; height: auto; aspect-ratio: 16/9;"></video>
        </div>
        
        <div class="player-title" id="playerTitle">未在播放</div>
        
        <div class="player-progress-area">
          <div class="player-progress-wrap">
            <div class="player-progress-bg">
              <div class="player-progress" id="playerProgressBar"></div>
            </div>
          </div>
          <div class="player-time-wrap">
            <span id="playerTime" class="player-time">0:00 / 0:00</span>
          </div>
        </div>
        
        <div class="player-controls-area">
          <div class="player-controls-row">
            <button id="backwardBtn" class="control-btn"><img src="ico/rewind10.svg" alt="后退10秒"></button>
            <button id="prevBtn" class="control-btn"><img src="ico/prev.svg" alt="上一首"></button>
            <button id="playPauseBtn" class="control-btn main-btn"><img id="playPauseIcon" src="ico/play.svg" alt="播放"></button>
            <button id="nextBtn" class="control-btn"><img src="ico/next.svg" alt="下一首"></button>
            <button id="forwardBtn" class="control-btn"><img src="ico/forward5.svg" alt="快进5秒"></button>
          </div>
          
          <div class="player-controls-row">
            <button id="loopBtn" class="control-btn secondary-btn">
              <img src="ico/loop.svg" alt="循环">
            </button>
            <select id="playerSpeed" class="speed-select secondary-btn">
              <option value="0.5">x0.5</option>
              <option value="1" selected>x1</option>
              <option value="1.5">x1.5</option>
              <option value="2">x2</option>
            </select>
          </div>
        </div>
      </div>
    `;
    
    // 初始化视频元素
    this.video = this.container.querySelector('#playerVideo');
    this.videoArea = this.container.querySelector('#playerVideoArea');
    this.video.controls = true;
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
    
    // 阻止播放器区域的触摸和滚轮事件，防止页面滚动
    const playerBar = this.container.querySelector('.player-bar');
    playerBar.addEventListener('touchstart', (e) => {
      if (e.target === playerBar) {
        e.preventDefault();
      }
    }, { passive: false });
    
    playerBar.addEventListener('touchmove', (e) => {
      if (e.target === playerBar) {
        e.preventDefault();
      }
    }, { passive: false });
    
    playerBar.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });

    // 音频事件
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onEnded());
  }

  play(idx) {
    if (idx < 0 || idx >= this.musicFiles.length) return;
    this.currentIndex = idx;
    const item = this.musicFiles[idx];
    
    if (item.type === 'video') {
      // 播放视频
      this.videoArea.style.display = 'block';
      // 隐藏进度条区域
      this.container.querySelector('.player-progress-area').style.display = 'none';
      
      this.video.src = item.file;
      this.video.playbackRate = this.speed;
      this.video.loop = this.isLoop;
      this.video.play();
      
      // 暂停音频
      this.audio.pause();
      this.isPlaying = true;
    } else {
      // 播放音频
      this.videoArea.style.display = 'none';
      // 显示进度条区域
      this.container.querySelector('.player-progress-area').style.display = 'block';
      
      this.audio.src = item.file;
      this.audio.playbackRate = this.speed;
      this.audio.loop = this.isLoop;
      this.audio.play();
      this.isPlaying = true;
    }
    
    this.updateUI();
    this.playlist.setCurrentIndex(idx);
  }

  togglePlayPause() {
    if (this.currentIndex === -1) {
      this.play(0);
      return;
    }
    
    const item = this.musicFiles[this.currentIndex];
    if (item.type === 'video') {
      if (this.video.paused) {
        this.video.play();
        this.isPlaying = true;
      } else {
        this.video.pause();
        this.isPlaying = false;
      }
    } else {
      if (this.audio.paused) {
        this.audio.play();
        this.isPlaying = true;
      } else {
        this.audio.pause();
        this.isPlaying = false;
      }
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
    const item = this.currentIndex >= 0 ? this.musicFiles[this.currentIndex] : null;
    if (item && item.type === 'video') {
      this.video.currentTime = Math.max(this.video.currentTime - 10, 0);
    } else {
      this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
    }
  }

  forward5s() {
    const item = this.currentIndex >= 0 ? this.musicFiles[this.currentIndex] : null;
    if (item && item.type === 'video') {
      this.video.currentTime = Math.min(this.video.currentTime + 5, this.video.duration || 0);
    } else {
      this.audio.currentTime = Math.min(this.audio.currentTime + 5, this.audio.duration || 0);
    }
  }

  toggleLoop() {
    this.isLoop = !this.isLoop;
    this.audio.loop = this.isLoop;
    if (this.video) {
      this.video.loop = this.isLoop;
    }
    this.updateUI();
  }

  setSpeed(val) {
    this.speed = parseFloat(val);
    this.audio.playbackRate = this.speed;
    if (this.video) {
      this.video.playbackRate = this.speed;
    }
  }

  updateProgress() {
    const progressBar = this.container.querySelector('#playerProgressBar');
    const playerTime = this.container.querySelector('#playerTime');
    
    const item = this.currentIndex >= 0 ? this.musicFiles[this.currentIndex] : null;
    let currentTime = 0;
    let duration = 0;
    
    if (item && item.type === 'video') {
      currentTime = this.video.currentTime;
      duration = this.video.duration;
    } else {
      currentTime = this.audio.currentTime;
      duration = this.audio.duration;
    }
    
    if (duration) {
      const percent = (currentTime / duration) * 100;
      progressBar.style.width = percent + '%';
      playerTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
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
    playPauseIcon.src = this.isPlaying ? 'ico/pause.svg' : 'ico/play.svg';
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
