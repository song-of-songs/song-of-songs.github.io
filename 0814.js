// 全屏功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 创建全屏按钮
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.title = '全屏显示';
    document.body.appendChild(fullscreenBtn);

    // 全屏切换函数
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            // 进入全屏
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            fullscreenBtn.innerHTML = '⛶';
        } else {
            // 退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            fullscreenBtn.innerHTML = '⛶';
        }
    }

    // 添加点击事件
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // 监听全屏变化
    document.addEventListener('fullscreenchange', updateButton);
    document.addEventListener('webkitfullscreenchange', updateButton);
    document.addEventListener('msfullscreenchange', updateButton);

    function updateButton() {
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = '⛶';
        } else {
            fullscreenBtn.innerHTML = '⛶';
        }
    }
});
