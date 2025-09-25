/**
 * My3DApp - Babylon.js React Native 3D应用
 * 使用Babylon.js React Native创建3D场景
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, Alert } from 'react-native';
import { EngineView, useEngine } from '@babylonjs/react-native';
import { Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, Color3, Color4, StandardMaterial } from '@babylonjs/core';

const App = () => {
  const engine = useEngine();
  const sceneRef = useRef<Scene | null>(null);
  const [engineReady, setEngineReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeBabylon = async () => {
      if (!engine) {
        console.log('Babylon.js引擎未初始化');
        console.log(engine)
        setInitializationError('Babylon.js引擎未初始化');
        Alert.alert('引擎初始化', 'Babylon.js引擎初始化失败！请检查依赖和权限配置。');
        return;
      }

      try {
        console.log('开始初始化Babylon.js引擎...');
        
        // 等待引擎完全就绪
        await new Promise<void>(resolve => setTimeout(resolve, 100));
        
        const scene = new Scene(engine);
        sceneRef.current = scene;

        // 设置背景颜色
        scene.clearColor = new Color4(0.1, 0.1, 0.1, 1.0);

        // 设置相机
        const camera = new ArcRotateCamera(
          'camera',
          -Math.PI / 2,
          Math.PI / 2.5,
          5,
          new Vector3(0, 1, 0),
          scene
        );
        camera.attachControl();
        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        camera.wheelPrecision = 50;

        // 添加光源
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.intensity = 0.8;

        // 创建简单的3D物体
        const sphere = Mesh.CreateSphere('sphere', 32, 2, scene);
        sphere.position.y = 1.5;

        const ground = Mesh.CreateGround('ground', 10, 10, 2, scene);
        ground.position.y = -1;

        // 设置材质颜色
        const sphereMaterial = new StandardMaterial('sphereMaterial', scene);
        sphereMaterial.diffuseColor = new Color3(0.4, 0.4, 1.0);
        sphereMaterial.specularColor = new Color3(0.4, 0.4, 0.4);
        sphere.material = sphereMaterial;

        const groundMaterial = new StandardMaterial('groundMaterial', scene);
        groundMaterial.diffuseColor = new Color3(0.3, 0.6, 0.3);
        ground.material = groundMaterial;

        // 添加简单的动画
        let angle = 0;
        engine.runRenderLoop(() => {
          if (scene.activeCamera) {
            angle += 0.01;
            sphere.rotation.y = angle;
            scene.render();
          }
        });

        console.log('Babylon.js引擎已成功初始化');
        setEngineReady(true);
        Alert.alert('引擎初始化', 'Babylon.js引擎已成功初始化！');

      } catch (error) {
        console.error('Babylon.js初始化错误:', error);
        setInitializationError(error instanceof Error ? error.message : '未知错误');
        Alert.alert('引擎初始化错误', `初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    };

    initializeBabylon();

    return () => {
      if (engine) {
        console.log('清理3D场景');
        engine.stopRenderLoop();
      }
    };
  }, [engine]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <Text style={styles.title}>My3DApp - Babylon.js React Native</Text>
      <Text style={styles.subtitle}>3D场景示例</Text>
      
      <View style={styles.engineContainer}>
        <EngineView style={styles.engineView} />
        {!engineReady && (
          <View style={styles.overlay}>
            <Text style={styles.loadingText}>初始化3D引擎...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>• 旋转的蓝色球体</Text>
        <Text style={styles.infoText}>• 绿色地面</Text>
        <Text style={styles.infoText}>• 可交互3D场景</Text>
        <Text style={styles.infoText}>• 支持触摸旋转和缩放</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  engineContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  engineView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
});

export default App;
