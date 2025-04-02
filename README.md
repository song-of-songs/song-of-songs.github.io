# 樱花树下五子棋

这是一个基于 HTML5 Canvas 实现的五子棋游戏，支持玩家与 AI 对战。

## 功能特点

- **玩家与 AI 对战**：玩家可以与简单的 AI 进行五子棋对战。
- **棋盘绘制**：棋盘为 15x15 的交叉点，棋子落在交叉点上。
- **胜利检测**：支持检测五子连珠的胜利条件。
- **响应式设计**：棋盘边缘留有边距，棋子完整显示，视觉效果良好。

## 文件结构

song-of-songs.github.io/ ├── index.html # 主页面文件 ├── styles.css # 样式文件，定义了页面和棋盘的样式 ├── gobang.js # 游戏逻辑文件，包含棋盘绘制、玩家与 AI 的交互逻辑 └── README.md # 项目说明文件

## 使用方法

1. 克隆或下载此项目到本地：
   ```bash
   git clone https://github.com/your-username/song-of-songs.github.io.git
   cd song-of-songs.github.io
2. 打开 index.html 文件即可在浏览器中运行游戏。

## 游戏规则

1. 玩家点击棋盘交叉点落子，黑棋为玩家，白棋为 AI。
2. 玩家与 AI 轮流落子，先形成五子连珠的一方获胜。
3. 游戏结束后，可刷新页面重新开始。

## 技术栈

- HTML5：用于页面结构和 Canvas 绘制。
- CSS3：用于页面样式设计。
- JavaScript：实现游戏逻辑和交互。

## 未来改进

- 提升 AI 的智能程度，支持更复杂的策略。
- 增加游戏重新开始的按钮。
- 支持多人对战模式。

## 贡献

欢迎对该项目提出建议或贡献代码！您可以通过提交 Issue 或 Pull Request 的方式参与。

## 许可证

该项目使用 MIT License。