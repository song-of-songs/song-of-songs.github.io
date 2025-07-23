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
    this.enableVideoPlayback = false; // 视频播放功能开关
    this.render();
    this.bindEvents();
    this.updateUI();
  }

  render() {
    this.container.innerHTML = `
      <div class="player-bar">
        <!-- 加载状态指示器 -->
        <div id="playerLoading" style="display: none; text-align: center; padding: 10px; color: #e0e0e0;">
          加载中...
        </div>
        
        <!-- 视频播放区域 -->
        <div id="playerVideoArea" style="display: none; text-align: center; margin-bottom: 10px;">
          <video id="playerVideo" style="width: 100%; height: auto; aspect-ratio: 16/9;"></video>
        </div>
        
        <div class="player-title" id="playerTitle">未在播放</div>
        
        <div class="player-progress-area">
          <div class="player-progress-wrap">
            <div class="player-progress-bg">
              <!-- 缓冲进度条 -->
              <div class="player-buffer" id="playerBufferBar"></div>
              <!-- 播放进度条 -->
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
    
    // 初始化加载状态元素
    this.loadingIndicator = this.container.querySelector('#playerLoading');
    this.errorMessage = null;
    
    // 初始化缓冲进度条元素
    this.bufferBar = this.container.querySelector('#playerBufferBar');
  }

  bindEvents() {
    this.container.querySelector('#playPauseBtn').onclick = () => this.togglePlayPause();
    this.container.querySelector('#prevBtn').onclick = () => this.playPrev();
    this.container.querySelector('#nextBtn').onclick = () => this.playNext();
    this.container.querySelector('#backwardBtn').onclick = () => this.backward10s();
    this.container.querySelector('#forwardBtn').onclick = () => this.forward5s();
    this.container.querySelector('#loopBtn').onclick = () => this.toggleLoop();
    this.container.querySelector('#playerSpeed').onchange = (e) => this.setSpeed(e.target.value);
    
    // 音频缓冲事件
    this.audio.addEventListener('progress', () => this.updateBufferProgress());
    
    // 视频缓冲事件
    this.video.addEventListener('progress', () => this.updateBufferProgress());

    // 进度条点击跳转（支持视频和音频）
    this.container.querySelector('.player-progress-bg').onclick = (e) => {
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      
      const item = this.currentIndex >= 0 ? this.musicFiles[this.currentIndex] : null;
      if (item && item.type === 'video' && this.enableVideoPlayback) {
        if (this.video.duration) this.video.currentTime = percent * this.video.duration;
      } else {
        if (this.audio.duration) this.audio.currentTime = percent * this.audio.duration;
      }
    };
    
    // 阻止整个播放器区域的触摸事件，防止页面滚动
    this.container.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    this.container.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    // 阻止整个播放器区域的滚轮事件
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    // 为所有交互元素添加额外的触摸事件阻止（确保事件不会冒泡到父元素）
    const interactiveElements = this.container.querySelectorAll('button, .player-progress-bg, .speed-select');
    interactiveElements.forEach(el => {
      el.addEventListener('touchstart', (e) => {
        e.stopPropagation();
      });
      el.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      });
    });

    // 音频事件
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onEnded());
    
    // 视频结束事件处理
    this.video.addEventListener('ended', () => this.onVideoEnded());
  }

  play(idx) {
    if (idx < 0 || idx >= this.musicFiles.length) return;
    
    // 清除之前的错误信息
    if (this.errorMessage) {
      this.errorMessage.remove();
      this.errorMessage = null;
    }
    
    // 显示加载指示器
    this.loadingIndicator.style.display = 'block';
    
    this.currentIndex = idx;
    const item = this.musicFiles[idx];
    
    // 始终隐藏视频区域
    this.videoArea.style.display = 'none';
    
    // 设置加载完成后的回调
    const onLoaded = () => {
      this.loadingIndicator.style.display = 'none';
      this.isPlaying = true;
      this.updateUI();
      this.playlist.setCurrentIndex(idx);
    };
    
    // 设置加载失败的回调
    const onError = () => {
      this.loadingIndicator.style.display = 'none';
      this.showError(`加载失败: ${item.name}`);
      this.isPlaying = false;
      this.updateUI();
    };
    
    if (this.enableVideoPlayback && item.type === 'video') {
      // 播放视频（如果启用视频播放）
      this.videoArea.style.display = 'block';
      // 显示进度条区域（视频也需要进度条）
      this.container.querySelector('.player-progress-area').style.display = 'block';
      
      // 重置视频并设置新源
      this.video.src = '';
      this.video.src = item.file;
      this.video.playbackRate = this.speed;
      this.video.loop = this.isLoop;
      
      // 移除旧的事件监听器
      this.video.removeEventListener('canplay', onLoaded);
      this.video.removeEventListener('error', onError);
      
      // 添加新的事件监听器
      this.video.addEventListener('canplay', onLoaded, { once: true });
      this.video.addEventListener('error', onError, { once: true });
      
      this.video.play().catch(e => {
        console.error('视频播放失败:', e);
        onError();
      });
      
      // 暂停音频
      this.audio.pause();
    } else if (item.type === 'video') {
      // 视频播放功能关闭时，将视频文件作为音频播放
      // 显示进度条区域
      this.container.querySelector('.player-progress-area').style.display = 'block';
      
      // 重置音频并设置新源
      this.audio.src = '';
      this.audio.src = item.file;
      this.audio.playbackRate = this.speed;
      this.audio.loop = this.isLoop;
      
      // 移除旧的事件监听器
      this.audio.removeEventListener('canplay', onLoaded);
      this.audio.removeEventListener('error', onError);
      
      // 添加新的事件监听器
      this.audio.addEventListener('canplay', onLoaded, { once: true });
      this.audio.addEventListener('error', onError, { once: true });
      
      this.audio.play().catch(e => {
        console.error('音频播放失败:', e);
        onError();
      });
      
      // 确保视频区域隐藏
      this.videoArea.style.display = 'none';
    } else {
      // 播放普通音频文件
      // 显示进度条区域
      this.container.querySelector('.player-progress-area').style.display = 'block';
      
      // 重置音频并设置新源
      this.audio.src = '';
      this.audio.src = item.file;
      this.audio.playbackRate = this.speed;
      this.audio.loop = this.isLoop;
      
      // 移除旧的事件监听器
      this.audio.removeEventListener('canplay', onLoaded);
      this.audio.removeEventListener('error', onError);
      
      // 添加新的事件监听器
      this.audio.addEventListener('canplay', onLoaded, { once: true });
      this.audio.addEventListener('error', onError, { once: true });
      
      this.audio.play().catch(e => {
        console.error('音频播放失败:', e);
        onError();
      });
    }
  }
  
  // 显示错误信息
  showError(message) {
    // 移除现有的错误信息
    if (this.errorMessage) {
      this.errorMessage.remove();
    }
    
    // 创建错误信息元素
    this.errorMessage = document.createElement('div');
    this.errorMessage.textContent = message;
    this.errorMessage.style.color = '#ff6b6b';
    this.errorMessage.style.textAlign = 'center';
    this.errorMessage.style.padding = '10px';
    this.errorMessage.style.marginTop = '10px';
    
    // 插入到播放器区域
    const playerBar = this.container.querySelector('.player-bar');
    playerBar.insertBefore(this.errorMessage, playerBar.firstChild);
  }

  togglePlayPause() {
    if (this.currentIndex === -1) {
      this.play(0);
      return;
    }
    
    const item = this.musicFiles[this.currentIndex];
    // 检查是否启用了视频播放并且当前项是视频
    const isVideo = this.enableVideoPlayback && item.type === 'video';
    
    if (isVideo) {
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
    // 检查是否启用了视频播放并且当前项是视频
    const isVideo = item && this.enableVideoPlayback && item.type === 'video';
    
    if (isVideo) {
      this.video.currentTime = Math.max(this.video.currentTime - 10, 0);
    } else {
      this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
    }
  }

  forward5s() {
    const item = this.currentIndex >= 0 ? this.musicFiles[this.currentIndex] : null;
    // 检查是否启用了视频播放并且当前项是视频
    const isVideo = item && this.enableVideoPlayback && item.type === 'video';
    
    if (isVideo) {
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

  // 更新缓冲进度
  updateBufferProgress() {
    const item = this.currentIndex >= 0 ? this.musicFiles[this.currentIndex] : null;
    if (!item) return;
    
    let buffered = 0;
    let duration = 0;
    
    if (item && item.type === 'video' && this.enableVideoPlayback) {
      if (this.video.buffered.length > 0) {
        buffered = this.video.buffered.end(this.video.buffered.length - 1);
      }
      duration = this.video.duration;
    } else {
      if (this.audio.buffered.length > 0) {
        buffered = this.audio.buffered.end(this.audio.buffered.length - 1);
      }
      duration = this.audio.duration;
    }
    
    if (duration > 0) {
      const percent = (buffered / duration) * 100;
      this.bufferBar.style.width = percent + '%';
    }
  }

  updateProgress() {
    const progressBar = this.container.querySelector('#playerProgressBar');
    const playerTime = this.container.querySelector('#playerTime');
    
    const item = this.currentIndex >= 0 ? this.musicFiles[this.currentIndex] : null;
    let currentTime = 0;
    let duration = 0;
    
    if (item && item.type === 'video' && this.enableVideoPlayback) {
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
    
    // 更新缓冲进度
    this.updateBufferProgress();
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
  
  onVideoEnded() {
    if (this.isLoop) {
      this.video.currentTime = 0;
      this.video.play();
    } else {
      this.playNext();
    }
  }
}
