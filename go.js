// 从根目录动态加载 musicFiles.json 文件生成 musicFiles 数组
let musicFiles = [];

const musicList = document.getElementById('musicList');
const audio = document.getElementById('audio');
const playerTitle = document.getElementById('playerTitle');
const playerProgressBar = document.getElementById('playerProgressBar');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = -1;
let isPlaying = false;
let progressTimer = null;

// 渲染音乐列表
function renderMusicList() {
  musicList.innerHTML = '';
  musicFiles.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = idx === currentIndex ? 'active' : '';
    li.innerHTML = `
      <span>${item.name}</span>
      <button class="play-btn" data-idx="${idx}">${idx === currentIndex && isPlaying ? '⏸️' : '▶️'}</button>
    `;
    musicList.appendChild(li);
  });
}

// 播放指定索引的音乐
function playMusic(idx) {
  if (idx < 0 || idx >= musicFiles.length) return;
  currentIndex = idx;
  audio.src = musicFiles[idx].file;
  playerTitle.textContent = musicFiles[idx].name;
  isPlaying = true;
  audio.play();
  renderMusicList();
  playPauseBtn.textContent = '⏸️';
}

// 切换播放/暂停
function togglePlayPause() {
  if (currentIndex === -1) {
    playMusic(0);
    return;
  }
  if (audio.paused) {
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
  } else {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = '▶️';
  }
  renderMusicList();
}

// 上一首
function playPrev() {
  if (currentIndex > 0) {
    playMusic(currentIndex - 1);
  } else {
    playMusic(musicFiles.length - 1);
  }
}

// 下一首
function playNext() {
  if (currentIndex < musicFiles.length - 1) {
    playMusic(currentIndex + 1);
  } else {
    playMusic(0);
  }
}

// 工具函数：格式化秒为 mm:ss
function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// 进度条更新
function updateProgress() {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    playerProgressBar.style.width = percent + '%';
    // 显示时间到播放器组件内
    let timeElem = document.getElementById('playerTime');
    if (!timeElem) {
      timeElem = document.createElement('span');
      timeElem.id = 'playerTime';
      timeElem.style.marginLeft = '16px';
      timeElem.style.fontSize = '15px';
      timeElem.style.color = '#7b3fa0';
      // 假设播放器组件有 .player-bar 类
      const playerBar = document.querySelector('.player-bar');
      if (playerBar) {
        // 避免重复插入
        let oldTimeElem = playerBar.querySelector('#playerTime');
        if (!oldTimeElem) {
          // 插入到进度条后面
          const progressWrap = playerBar.querySelector('.player-progress');
          if (progressWrap && progressWrap.parentNode) {
            progressWrap.parentNode.insertBefore(timeElem, progressWrap.nextSibling);
          } else {
            playerBar.appendChild(timeElem);
          }
        } else {
          timeElem = oldTimeElem;
        }
      }
    }
    timeElem.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  } else {
    playerProgressBar.style.width = '0%';
    let timeElem = document.getElementById('playerTime');
    if (timeElem) timeElem.textContent = '0:00 / 0:00';
  }
}

// 点击进度条跳转
document.querySelector('.player-progress').addEventListener('click', function(e) {
  if (!audio.duration) return;
  const rect = this.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
});

// 快进5秒
function forward5s() {
  if (audio.duration) {
    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
  }
}

// 后退10秒
function backward10s() {
  audio.currentTime = Math.max(audio.currentTime - 10, 0);
}

// 事件绑定
musicList.addEventListener('click', function(e) {
  if (e.target.classList.contains('play-btn')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    if (idx === currentIndex && isPlaying) {
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶️';
      renderMusicList();
    } else {
      playMusic(idx);
    }
  }
});

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);

audio.addEventListener('play', () => {
  isPlaying = true;
  playPauseBtn.textContent = '⏸️';
  renderMusicList();
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(updateProgress, 300);
});
audio.addEventListener('pause', () => {
  isPlaying = false;
  playPauseBtn.textContent = '▶️';
  renderMusicList();
  if (progressTimer) clearInterval(progressTimer);
});
audio.addEventListener('ended', playNext);
audio.addEventListener('timeupdate', updateProgress);

// 初始化，加载 musicFiles.json 后再渲染
fetch('musicFiles.json')
  .then(res => res.json())
  .then(data => {
    musicFiles = data;
    renderMusicList();
    updateProgress(); // 保证初始状态就显示进度条时间
  })
  .catch(err => {
    console.error('无法加载 musicFiles.json:', err);
    renderMusicList();
    updateProgress(); // 即使加载失败也显示初始进度条时间
  });

// 你可以在播放器控制区添加按钮并绑定事件，例如：
// 假设HTML中有<button id="backwardBtn">⏪10s</button> <button id="forwardBtn">5s⏩</button>
const backwardBtn = document.getElementById('backwardBtn');
const forwardBtn = document.getElementById('forwardBtn');

if (backwardBtn) backwardBtn.addEventListener('click', backward10s);
if (forwardBtn) forwardBtn.addEventListener('click', forward5s);

// 页面加载时也调用一次，确保初始状态有进度条时间
document.addEventListener('DOMContentLoaded', updateProgress);