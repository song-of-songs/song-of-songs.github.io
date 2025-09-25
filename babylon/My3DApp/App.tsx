/**
 * My3DApp - Babylon.js React Native 3D应用
 * 使用Babylon.js React Native创建3D场景
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { EngineView, useEngine } from '@babylonjs/react-native';
import { Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, Color3, StandardMaterial } from '@babylonjs/core';

const App = () => {
  const engine = useEngine();
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    if (engine) {
      const scene = new Scene(engine);
      sceneRef.current = scene;

      // 设置相机
      const camera = new ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 2.5,
        3,
        new Vector3(0, 0, 0),
        scene
      );
      camera.attachControl();

      // 添加光源
      const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      // 创建简单的3D物体
      const sphere = Mesh.CreateSphere('sphere', 16, 2, scene);
      sphere.position.y = 1;

      const ground = Mesh.CreateGround('ground', 6, 6, 2, scene);

      // 设置材质颜色
      const sphereMaterial = new StandardMaterial('sphereMaterial', scene);
      sphereMaterial.diffuseColor = new Color3(0.4, 0.4, 1.0);
      sphere.material = sphereMaterial;

      const groundMaterial = new StandardMaterial('groundMaterial', scene);
      groundMaterial.diffuseColor = new Color3(0.4, 0.8, 0.4);
      ground.material = groundMaterial;

      // 开始渲染循环
      engine.runRenderLoop(() => {
        if (scene.activeCamera) {
          scene.render();
        }
      });

      return () => {
        engine.stopRenderLoop();
      };
    }
  }, [engine]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>My3DApp - Babylon.js React Native</Text>
      <Text style={styles.subtitle}>3D场景示例</Text>
      
      {engine ? (
        <View style={styles.engineContainer}>
          <EngineView style={styles.engineView} />
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>初始化3D引擎...</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>• 旋转球体</Text>
        <Text style={styles.infoText}>• 绿色地面</Text>
        <Text style={styles.infoText}>• 可交互3D场景</Text>
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
    color: '#666',
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
