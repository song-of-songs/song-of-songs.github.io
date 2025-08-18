document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const timeText = document.querySelector('.time-text');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const countUpBtn = document.getElementById('countUpBtn');
    const countDownBtn = document.getElementById('countDownBtn');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const progressRing = document.querySelector('.progress-ring__circle');

    // 计算圆周长 - 用于SVG进度条
    const radius = progressRing.r.baseVal.value; // 获取SVG圆的半径
    const circumference = 2 * Math.PI * radius; // 计算圆周长: 2πr
    progressRing.style.strokeDasharray = circumference; // 设置虚线模式为完整圆周长

    // 计时器变量
    let timer;
    let totalSeconds = 0;
    let isRunning = false;
    let isCountUp = true;
    let initialSeconds = 0;

    // 更新时间显示
    function updateTimeDisplay() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        timeText.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新进度条
        let progressOffset; // 存储进度条偏移量
        if (isCountUp) {
            // 默认
            progressOffset = 0;
            // 正计时模式: 进度条从空到满
            // progressOffset = initialSeconds > 0
            //     ? circumference - (totalSeconds / initialSeconds * circumference) // 计算剩余比例
            //     : 0; // 如果没有设置初始时间，保持空状态
        } else {
            // 倒计时模式: 进度条从满到空
            progressOffset = initialSeconds > 0
                ? circumference - (totalSeconds / initialSeconds * circumference) // 计算已用比例
                : 0; // 如果没有设置初始时间，保持满状态
        }
        // 确保偏移量在0-circumference范围内，并应用到SVG
        progressRing.style.strokeDashoffset = Math.min(Math.max(progressOffset, 0), circumference);
    }

    // 开始计时
    function startTimer() {
        if (isRunning) return;
        
        if (!isCountUp) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            initialSeconds = hours * 3600 + minutes * 60 + seconds;
            totalSeconds = initialSeconds;
            
            if (totalSeconds <= 0) {
                alert('请设置倒计时时间！');
                return;
            }
        }

        isRunning = true;
        timer = setInterval(() => {
            if (isCountUp) {
                totalSeconds++;
            } else {
                if (totalSeconds <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    alert('时间到！');
                    return;
                }
                totalSeconds--;
            }
            updateTimeDisplay();
        }, 1000);
    }

    // 暂停计时
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
    }

    // 重置计时
    function resetTimer() {
        pauseTimer();
        totalSeconds = isCountUp ? 0 : initialSeconds;
        updateTimeDisplay();
    }

    // 切换计时模式
    function setCountUpMode() {
        isCountUp = true;
        resetTimer();
        countUpBtn.disabled = true;
        countDownBtn.disabled = false;
    }

    function setCountDownMode() {
        isCountUp = false;
        resetTimer();
        countUpBtn.disabled = false;
        countDownBtn.disabled = true;
    }

    // 事件监听
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    countUpBtn.addEventListener('click', setCountUpMode);
    countDownBtn.addEventListener('click', setCountDownMode);

    // 初始化
    setCountUpMode();
    progressRing.style.strokeDashoffset = circumference; // 默认显示空状态(偏移量为圆周长)
    updateTimeDisplay();
});
