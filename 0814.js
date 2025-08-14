document.addEventListener('DOMContentLoaded', function() {
    // 初始化幻灯片
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    slides[currentSlide].classList.add('active');
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });
    
    // 翻页函数
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    function prevSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // 全屏切换函数
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    document.body.classList.add('fullscreen');
                })
                .catch(err => {
                    console.error(`全屏错误: ${err.message}`);
                });
        } else {
            document.exitFullscreen()
                .then(() => {
                    document.body.classList.remove('fullscreen');
                });
        }
    }
    
    // 全屏状态变化监听
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            document.body.classList.remove('fullscreen');
        }
    });
});
