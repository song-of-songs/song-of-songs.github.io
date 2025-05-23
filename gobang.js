const canvas = document.getElementById("gobang");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");

const boardSize = 15; // 棋盘交叉点数量
const margin = 20; // 棋盘边距
let cellSize = (canvas.width - 2 * margin) / (boardSize - 1); // 每个格子的大小
const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0)); // 0: 空, 1: 玩家, 2: AI

let gameOver = false;

// 添加樱花飘落动画
const sakuraImages = [];
const sakuraCount = 30; // 樱花数量
const sakuraParticles = [];

// 加载樱花 SVG 图片
for (let i = 0; i < sakuraCount; i++) {
    const img = new Image();
    img.src = "sakura.svg"; // 确保项目中有一张名为 sakura.svg 的 SVG 文件
    sakuraImages.push(img);
}

// 初始化樱花粒子
function initSakuraParticles() {
    sakuraParticles.length = 0;
    for (let i = 0; i < sakuraCount; i++) {
        sakuraParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 20 + 10, // 樱花大小
            speedX: Math.random() * 2 - 1, // 水平速度
            speedY: Math.random() * 2 + 1, // 垂直速度
            rotation: Math.random() * 360, // 初始旋转角度
            rotationSpeed: Math.random() * 2 - 1, // 旋转速度
            image: sakuraImages[Math.floor(Math.random() * sakuraImages.length)],
        });
    }
}

// 绘制樱花粒子
function drawSakuraParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    drawBoard(); // 重新绘制棋盘

    // 先绘制棋子
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            if (board[x][y] === 1) {
                drawPiece(x, y, 1);
            } else if (board[x][y] === 2) {
                drawPiece(x, y, 2);
            }
        }
    }

    // 再绘制樱花粒子
    for (const particle of sakuraParticles) {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.drawImage(
            particle.image,
            -particle.size / 2,
            -particle.size / 2,
            particle.size,
            particle.size
        );
        ctx.restore();

        // 更新粒子位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // 如果粒子超出屏幕，重置到顶部
        if (particle.y > canvas.height || particle.x < -50 || particle.x > canvas.width + 50) {
            particle.x = Math.random() * canvas.width;
            particle.y = -50;
            particle.size = Math.random() * 20 + 10;
            particle.speedX = Math.random() * 2 - 1;
            particle.speedY = Math.random() * 2 + 1;
            particle.rotation = Math.random() * 360;
            particle.rotationSpeed = Math.random() * 2 - 1;
        }
    }

    if (!gameOver) return; // 如果游戏未结束，不再继续动画
    requestAnimationFrame(drawSakuraParticles); // 循环动画
}

// 调整 Canvas 尺寸以适配设备
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const maxLogicalSize = 600; // 限制逻辑尺寸的最大宽度
    const deviceWidth = Math.min(rect.width, maxLogicalSize); // 取屏幕宽度和最大宽度的较小值

    canvas.width = deviceWidth; // 设置逻辑宽度
    canvas.height = deviceWidth; // 设置逻辑高度（保持正方形）

    // 重新计算单元格大小
    cellSize = (canvas.width - 2 * margin) / (boardSize - 1);

    // 重新绘制棋盘
    drawBoard();

    // 重新绘制棋子
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            if (board[x][y] === 1) {
                drawPiece(x, y, 1);
            } else if (board[x][y] === 2) {
                drawPiece(x, y, 2);
            }
        }
    }
}

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#333";
    for (let i = 0; i < boardSize; i++) {
        // 绘制横线
        ctx.beginPath();
        ctx.moveTo(margin, margin + i * cellSize);
        ctx.lineTo(canvas.width - margin, margin + i * cellSize);
        ctx.stroke();

        // 绘制竖线
        ctx.beginPath();
        ctx.moveTo(margin + i * cellSize, margin);
        ctx.lineTo(margin + i * cellSize, canvas.height - margin);
        ctx.stroke();
    }
}

// 绘制棋子
function drawPiece(x, y, player) {
    ctx.beginPath();
    ctx.arc(
        margin + x * cellSize,
        margin + y * cellSize,
        cellSize / 3,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = player === 1 ? "black" : "white";
    ctx.fill();
    ctx.stroke();
}

// 检查胜利条件
function checkWin(x, y, player) {
    const directions = [
        [1, 0], [0, 1], [1, 1], [1, -1]
    ];
    for (const [dx, dy] of directions) {
        let count = 1;
        for (let step = 1; step < 5; step++) {
            const nx = x + dx * step;
            const ny = y + dy * step;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === player) {
                count++;
            } else {
                break;
            }
        }
        for (let step = 1; step < 5; step++) {
            const nx = x - dx * step;
            const ny = y - dy * step;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === player) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 5) return true;
    }
    return false;
}

// 在棋盘上显示胜利提示语
function showResultMessage(message) {
    ctx.save(); // 保存当前绘图状态
    ctx.font = "48px Arial"; // 设置字体大小和样式
    ctx.fillStyle = "#ff7f7f"; // 设置浅红色字体颜色
    ctx.textAlign = "center"; // 文本居中
    ctx.textBaseline = "middle"; // 文本基线居中
    ctx.fillText(message, canvas.width / 2, canvas.height / 2); // 在棋盘中心绘制文本
    ctx.restore(); // 恢复绘图状态

    // 为 canvas 添加动画类，仅影响文字
    canvas.classList.add("win-message");

    // 移除动画类（可选，确保动画可以重复触发）
    setTimeout(() => {
        canvas.classList.remove("win-message");
    }, 1000); // 动画持续时间与 CSS 中的 `animation` 时间一致
}

// 修正点击位置的计算
canvas.addEventListener("click", (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - margin) / cellSize);
    const y = Math.round((e.clientY - rect.top - margin) / cellSize);

    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === 0) {
        board[x][y] = 1;
        drawPiece(x, y, 1);

        // 玩家获胜时调用
        if (checkWin(x, y, 1)) {
            gameOver = true;
            showResultMessage("玩家胜利了～");
            document.getElementById("status").textContent = "玩家胜利了～";
            document.getElementById("status").style.color = "#ff7f7f"; // 状态文字也变为浅红色
            initSakuraParticles(); // 初始化樱花粒子
            drawSakuraParticles(); // 开始樱花飘落动画
            return;
        }

        statusText.textContent = "轮到 AI 下棋...";
        setTimeout(aiMove, 500);
    }
});

// AI 下棋
function aiMove() {
    if (gameOver) return;

    let bestScore = -Infinity;
    let bestMove = null;

    // 遍历棋盘，寻找最佳落子点
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            if (board[x][y] === 0) {
                // 模拟 AI 落子
                board[x][y] = 2;
                const aiScore = evaluateBoard(2); // AI 的得分
                board[x][y] = 0;

                // 模拟玩家落子
                board[x][y] = 1;
                const playerScore = evaluateBoard(1); // 玩家得分
                board[x][y] = 0;

                // 综合得分：AI 优先得分 + 防守玩家威胁得分
                const score = aiScore + playerScore * 0.8; // 防守权重为 0.8

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { x, y };
                }
            }
        }
    }

    if (bestMove) {
        const { x, y } = bestMove;
        board[x][y] = 2;
        drawPiece(x, y, 2);

        // AI 获胜时调用
        if (checkWin(x, y, 2)) {
            gameOver = true;
            showResultMessage("AI胜利了～");
            document.getElementById("status").textContent = "AI胜利了～";
            document.getElementById("status").style.color = "#ff7f7f"; // 状态文字也变为浅红色
            initSakuraParticles(); // 初始化樱花粒子
            drawSakuraParticles(); // 开始樱花飘落动画
            return;
        }

        statusText.textContent = "轮到玩家下棋。";
    }
}

// 评估棋盘得分
function evaluateBoard(player) {
    let score = 0;

    const directions = [
        [1, 0], [0, 1], [1, 1], [1, -1]
    ];

    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            if (board[x][y] === player) {
                for (const [dx, dy] of directions) {
                    let count = 1;
                    let blocked = 0;

                    for (let step = 1; step < 5; step++) {
                        const nx = x + dx * step;
                        const ny = y + dy * step;
                        if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
                            if (board[nx][ny] === player) {
                                count++;
                            } else if (board[nx][ny] !== 0) {
                                blocked++;
                                break;
                            }
                        } else {
                            blocked++;
                            break;
                        }
                    }

                    for (let step = 1; step < 5; step++) {
                        const nx = x - dx * step;
                        const ny = y - dy * step;
                        if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
                            if (board[nx][ny] === player) {
                                count++;
                            } else if (board[nx][ny] !== 0) {
                                blocked++;
                                break;
                            }
                        } else {
                            blocked++;
                            break;
                        }
                    }

                    // 根据棋子数量和封堵情况评分
                    if (count >= 5) {
                        score += 10000; // 五连
                    } else if (count === 4 && blocked === 0) {
                        score += 1000; // 活四
                    } else if (count === 4 && blocked === 1) {
                        score += 500; // 冲四
                    } else if (count === 3 && blocked === 0) {
                        score += 200; // 活三
                    } else if (count === 3 && blocked === 1) {
                        score += 50; // 冲三
                    } else if (count === 2 && blocked === 0) {
                        score += 20; // 活二
                    }
                }
            }
        }
    }

    return score;
}

// 添加重新开始按钮的逻辑
document.getElementById("restart").addEventListener("click", () => {
    // 重置棋盘数据
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            board[x][y] = 0;
        }
    }

    // 重置游戏状态
    gameOver = false;
    statusText.textContent = "游戏开始！轮到玩家下棋。";
    statusText.style.color = "#4CAF50"; // 恢复状态文字为绿色

    // 清空樱花粒子
    sakuraParticles.length = 0;

    // 重新绘制棋盘
    drawBoard();
});

// 初始化时调整 Canvas 尺寸
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
    resizeCanvas();
    localStorage.clear();
    sessionStorage.clear();
});

// 初始化游戏
drawBoard();