# My3DApp - Babylon.js React Native 项目设置指南

## 项目概述
这是一个使用React Native和TypeScript创建的3D移动应用，集成了Babylon.js 3D图形引擎。

## 项目状态
- ✅ 项目结构已创建
- ✅ TypeScript配置已完成
- ✅ Babylon.js React Native集成
- ✅ iOS CocoaPods依赖配置 (74个依赖项，73个pods)
- ✅ Android构建配置 (minSdkVersion = 24)
- ✅ TypeScript编译验证 (编译成功)
- ✅ Metro bundler测试 (端口8082运行中)
- ✅ iOS依赖安装验证
- ✅ 项目文档更新

## 技术栈
- **React Native**: 0.81.4
- **TypeScript**: 5.8.3
- **Babylon.js React Native**: 1.9.0
- **Node.js**: >=20

## 项目结构
```
My3DApp/
├── App.tsx                 # 主应用组件（3D场景）
├── package.json            # 项目依赖配置
├── tsconfig.json          # TypeScript配置
├── android/               # Android原生代码
├── ios/                   # iOS原生代码
└── README.md              # 项目说明
```

## 安装和设置

### 1. 安装依赖
```bash
cd babylon/My3DApp
npm install
```

### 2. iOS设置（仅macOS）
```bash
# 安装CocoaPods依赖
cd ios
pod install
cd ..
```

### 3. 启动开发服务器
```bash
npm start
```

### 4. 运行应用

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## 3D功能特性

当前应用包含以下3D功能：
- **3D场景**: 使用Babylon.js引擎
- **交互式相机**: ArcRotateCamera支持旋转和缩放
- **基本几何体**: 球体和地面平面
- **光照系统**: 半球光源
- **材质系统**: 标准材质和颜色设置

## 开发指南

### 添加新的3D对象
```typescript
import { Mesh, Vector3 } from '@babylonjs/core';

// 创建立方体
const box = Mesh.CreateBox('box', 2, scene);
box.position = new Vector3(2, 1, 0);
```

### 相机控制
```typescript
const camera = new ArcRotateCamera(
  'camera',
  -Math.PI / 2,  // alpha (水平角度)
  Math.PI / 2.5, // beta (垂直角度)
  3,             // 距离
  new Vector3(0, 0, 0), // 目标点
  scene
);
```

### 材质和纹理
```typescript
import { StandardMaterial, Color3 } from '@babylonjs/core';

const material = new StandardMaterial('material', scene);
material.diffuseColor = new Color3(1, 0, 0); // 红色
sphere.material = material;
```

## 故障排除

### 常见问题

1. **Java运行时错误**
   - 安装Java Development Kit (JDK)
   - 设置JAVA_HOME环境变量

2. **iOS构建错误**
   - 确保已安装Xcode
   - 运行 `pod install` 安装CocoaPods依赖

3. **Android设备连接**
   - 启用USB调试
   - 安装Android SDK和平台工具

4. **Babylon.js导入错误**
   - 确保已安装 `@babylonjs/react-native` 和 `@babylonjs/core`
   - 检查TypeScript配置

### 开发工具检查
```bash
# 检查开发环境
npx react-native doctor

# 检查TypeScript编译
npx tsc --noEmit
```

## 下一步开发建议

1. **添加更多3D模型**: 导入GLTF或OBJ格式的3D模型
2. **动画系统**: 实现对象动画和过渡效果
3. **用户交互**: 添加触摸手势和3D对象交互
4. **物理引擎**: 集成物理模拟
5. **AR/VR支持**: 添加增强现实或虚拟现实功能

## 资源链接

- [React Native文档](https://reactnative.dev)
- [Babylon.js文档](https://doc.babylonjs.com)
- [Babylon.js React Native文档](https://doc.babylonjs.com/extensions/reactnative)
- [TypeScript文档](https://www.typescriptlang.org)

## 许可证
此项目基于React Native和Babylon.js的开源许可证。
