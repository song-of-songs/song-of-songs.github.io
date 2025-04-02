const canvas = document.getElementById("gobang");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");

const boardSize = 15; // 棋盘交叉点数量
const margin = 20; // 棋盘边距
const cellSize = (canvas.width - 2 * margin) / (boardSize - 1); // 每个格子的大小
const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0)); // 0: 空, 1: 玩家, 2: AI

let gameOver = false;

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

// 玩家下棋
canvas.addEventListener("click", (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - margin) / cellSize);
    const y = Math.round((e.clientY - rect.top - margin) / cellSize);

    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === 0) {
        board[x][y] = 1;
        drawPiece(x, y, 1);

        if (checkWin(x, y, 1)) {
            statusText.textContent = "玩家获胜！";
            gameOver = true;
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
                const score = evaluateBoard(2) - evaluateBoard(1); // AI 优先得分 - 玩家得分
                board[x][y] = 0; // 恢复空位

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

        if (checkWin(x, y, 2)) {
            statusText.textContent = "AI 获胜！";
            gameOver = true;
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

                    if (count >= 5) {
                        score += 10000; // 五连
                    } else if (count === 4 && blocked === 0) {
                        score += 1000; // 活四
                    } else if (count === 4 && blocked === 1) {
                        score += 100; // 冲四
                    } else if (count === 3 && blocked === 0) {
                        score += 100; // 活三
                    } else if (count === 3 && blocked === 1) {
                        score += 10; // 冲三
                    } else if (count === 2 && blocked === 0) {
                        score += 10; // 活二
                    }
                }
            }
        }
    }

    return score;
}

// 初始化游戏
drawBoard();