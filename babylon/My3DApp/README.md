# My3DApp - Babylon.js React Native 3D应用

一个使用React Native、TypeScript和Babylon.js构建的3D移动应用。

## 快速开始

### 前提条件
- Node.js >= 20
- npm 或 yarn
- iOS开发：macOS + Xcode
- Android开发：Android Studio

### 安装和运行

1. **安装依赖**
```bash
npm install
```

2. **iOS设置（仅macOS）**
```bash
cd ios
pod install
cd ..
```

3. **启动开发服务器**
```bash
npm start
```

4. **运行应用**

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 项目特性

- 🎯 **React Native 0.81.4** - 跨平台移动应用开发
- 🔷 **TypeScript 5.8.3** - 类型安全的开发体验
- 🎮 **Babylon.js 3D引擎** - 强大的3D图形渲染
- 📱 **原生性能** - 充分利用设备GPU能力

## 3D场景功能

当前应用包含：
- 交互式3D场景
- 可旋转和缩放的相机
- 基本几何体（球体、地面）
- 真实的光照系统
- 材质和颜色设置

## 开发

### 项目结构
```
My3DApp/
├── App.tsx          # 主应用组件
├── package.json     # 依赖配置
├── tsconfig.json   # TypeScript配置
├── android/        # Android原生代码
├── ios/            # iOS原生代码
└── README.md       # 项目说明
```

### 添加3D对象
```typescript
import { Mesh, Vector3 } from '@babylonjs/core';

// 创建立方体
const box = Mesh.CreateBox('box', 2, scene);
box.position = new Vector3(2, 1, 0);
```

## 故障排除

### 常见问题

**Metro bundler端口占用**
```bash
npm start -- --port 8082
```

**iOS构建错误**
```bash
cd ios && pod install && cd ..
```

**TypeScript编译检查**
```bash
npx tsc --noEmit
```

## 技术栈

- **前端框架**: React Native 0.81.4
- **3D引擎**: Babylon.js React Native 1.9.0
- **编程语言**: TypeScript 5.8.3
- **构建工具**: Metro bundler
- **包管理**: npm

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 联系方式

如有问题，请创建Issue或联系项目维护者。
