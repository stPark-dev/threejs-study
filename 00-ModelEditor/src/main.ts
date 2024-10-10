import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './style.css';
import * as THREE from 'three';

class App {
  private renderer: THREE.WebGLRenderer;
  private domApp: Element;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private controls?: OrbitControls;
  private model?: THREE.Object3D;
  private loader: GLTFLoader;

  constructor() {
    console.info("Hello Three.js");
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    
    this.domApp = document.querySelector("#app")!;
    this.domApp.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();

    this.loader = new GLTFLoader();

    this.setupCamera();
    this.setupLight();
    this.setupGrid();
    this.setupFileUpload();  // 파일 업로드 UI 처리
    this.setupEvents();
  }

  private setupCamera() {
    const domApp = this.domApp;
    const width = domApp.clientWidth;
    const height = domApp.clientHeight;

    this.camera = new THREE.PerspectiveCamera(78, width / height, 0.1, 100);
    this.camera.position.set(5, 5, 5);
    
    this.controls = new OrbitControls(this.camera, this.domApp as HTMLElement);
    this.controls.enableDamping = true;
  }

  private setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
  }

  private setupGrid() {
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);
  }

  private setupFileUpload() {
    // 파일 입력 요소
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    
    // 파일 선택 시 처리
    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.loadModelFromFile(file);
      }
    });
  }

  private loadModelFromFile(file: File) {
    const reader = new FileReader();

    // 파일이 로드되면 GLTF 로드
    reader.onload = (event) => {
      const contents = event.target?.result;
      if (typeof contents === 'string' || !contents) return;

      // 기존 모델을 삭제 (있는 경우)
      if (this.model) {
        this.scene.remove(this.model);
      }

      // ArrayBuffer 형태로 GLTF 모델 로드
      this.loader.parse(contents, '', (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);

        // 모델 초기 설정
        this.model.position.set(0, 0, 0);
        this.model.scale.set(1, 1, 1);
      });
    };

    // 파일을 ArrayBuffer로 읽음
    reader.readAsArrayBuffer(file);
  }

  private setupEvents() {
    window.onresize = this.resize.bind(this);
    this.resize();

    this.renderer.setAnimationLoop(this.render.bind(this));

    // 키보드 이벤트 처리 (모델 변형)
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private resize() {
    const width = this.domApp?.clientWidth;
    const height = this.domApp?.clientHeight;

    const camera = this.camera;
    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    this.renderer.setSize(width, height);
  }

  private update(time: number) {
    time *= 0.001;
    this.controls?.update();

    if (this.model) {
      this.model.rotation.y += 0.01;  // 자동 회전
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.model) return;

    switch (event.key) {
      case 'ArrowUp':
        this.model.position.y += 0.1;
        break;
      case 'ArrowDown':
        this.model.position.y -= 0.1;
        break;
      case 'ArrowLeft':
        this.model.rotation.y -= 0.1;
        break;
      case 'ArrowRight':
        this.model.rotation.y += 0.1;
        break;
      case '+':
        this.model.scale.multiplyScalar(1.1);
        break;
      case '-':
        this.model.scale.multiplyScalar(0.9);
        break;
    }
  }

  private render(time: number) {
    this.update(time);
    this.renderer.render(this.scene, this.camera!);
  }
}

new App();
