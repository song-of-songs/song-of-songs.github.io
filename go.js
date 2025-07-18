// 自动获取根目录“musicFiles”文件夹下的文件名，并生成musicFiles数组列表
async function fetchMusicFiles() {
  try {
    // 假设服务器支持目录API，返回文件名数组
    const res = await fetch('musicFiles/');
    const text = await res.text();
    // 解析目录列表（以Apache/Nginx目录列表为例）
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(href => href && href.endsWith('.mp3'));
    // 生成musicFiles数组
    return links.map(file => ({
      name: decodeURIComponent(file.replace('.mp3', '')),
      file: 'musicFiles/' + file
    }));
  } catch (e) {
    console.error('获取音乐文件失败', e);
    return [];
  }
}

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

// 进度条更新
function updateProgress() {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    playerProgressBar.style.width = percent + '%';
  } else {
    playerProgressBar.style.width = '0%';
  }
}

// 点击进度条跳转
document.querySelector('.player-progress').addEventListener('click', function(e) {
  if (!audio.duration) return;
  const rect = this.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
});

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

// 初始化
(async function () {
  musicFiles = await fetchMusicFiles();
  renderMusicList();
  updateProgress();
})();