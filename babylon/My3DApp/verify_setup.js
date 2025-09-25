#!/usr/bin/env node

/**
 * My3DApp 项目设置验证脚本
 * 验证React Native + Babylon.js + TypeScript项目设置是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 My3DApp 项目设置验证开始...\n');

// 检查关键文件是否存在
const requiredFiles = [
  'package.json',
  'App.tsx',
  'tsconfig.json',
  'ios/Podfile',
  'android/build.gradle',
  'node_modules/@babylonjs/react-native/package.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
});

// 检查package.json依赖
console.log('\n📦 检查依赖项...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@babylonjs/react-native',
    '@babylonjs/core',
    'react-native',
    'typescript'
  ];
  
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep}: ${dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - 依赖缺失`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ 无法读取package.json');
  allFilesExist = false;
}

// 检查TypeScript配置
console.log('\n🔷 检查TypeScript配置...');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.target) {
    console.log(`✅ TypeScript目标: ${tsconfig.compilerOptions.target}`);
  } else {
    console.log('⚠️ TypeScript配置不完整');
  }
} catch (error) {
  console.log('❌ 无法读取tsconfig.json');
  allFilesExist = false;
}

// 检查iOS Podfile
console.log('\n🍎 检查iOS配置...');
try {
  const podfile = fs.readFileSync('ios/Podfile', 'utf8');
  if (podfile.includes('use_react_native')) {
    console.log('✅ Podfile配置正确');
  } else {
    console.log('⚠️ Podfile可能需要更新');
  }
} catch (error) {
  console.log('❌ 无法读取Podfile');
  allFilesExist = false;
}

// 检查Android配置
console.log('\n🤖 检查Android配置...');
try {
  const buildGradle = fs.readFileSync('android/build.gradle', 'utf8');
  if (buildGradle.includes('minSdkVersion')) {
    console.log('✅ Android构建配置存在');
  } else {
    console.log('⚠️ Android配置可能需要检查');
  }
} catch (error) {
  console.log('❌ 无法读取Android构建配置');
  allFilesExist = false;
}

console.log('\n📊 验证结果:');
if (allFilesExist) {
  console.log('🎉 项目设置验证通过！所有必需文件都存在。');
  console.log('\n下一步操作:');
  console.log('1. 启动开发服务器: npm start');
  console.log('2. 运行Android应用: npm run android');
  console.log('3. 运行iOS应用: npm run ios (需要macOS)');
} else {
  console.log('❌ 项目设置存在问题，请检查上述错误信息。');
  console.log('\n建议操作:');
  console.log('1. 运行 npm install 安装依赖');
  console.log('2. 检查缺失的文件');
  console.log('3. 参考 PROJECT_SETUP.md 进行故障排除');
}

console.log('\n🔧 其他有用的命令:');
console.log('- 检查TypeScript编译: npx tsc --noEmit');
console.log('- 检查开发环境: npx react-native doctor');
console.log('- 清理缓存: npx react-native start --reset-cache');
